package clipboard

import (
	"sync"
	"syscall"
	"time"
	"unsafe"

	"github.com/lxn/win"
)

const WM_CLIPBOARDUPDATE = 0x031D

var (
	lastClipboardChange time.Time
	clipboardMutex      sync.Mutex
	onChangeCallback    func()
)

// MUST be global (never GC’d)
func wndProc(hwnd win.HWND, msg uint32, wParam, lParam uintptr) uintptr {
	switch msg {
	case WM_CLIPBOARDUPDATE:
		now := time.Now()

		clipboardMutex.Lock()
		if now.Sub(lastClipboardChange) > 150*time.Millisecond {
			lastClipboardChange = now
			clipboardMutex.Unlock()

			if onChangeCallback != nil {
				onChangeCallback()
			}
		} else {
			clipboardMutex.Unlock()
		}
		return 0
	}

	return win.DefWindowProc(hwnd, msg, wParam, lParam)
}

func StartClipboardListener(onChange func()) {
	onChangeCallback = onChange

	go func() {
		instance := win.GetModuleHandle(nil)

		className, _ := syscall.UTF16PtrFromString("ClipussyClipboardWindow")

		var wc win.WNDCLASSEX
		wc.CbSize = uint32(unsafe.Sizeof(wc))
		wc.LpfnWndProc = syscall.NewCallback(wndProc)
		wc.HInstance = instance
		wc.LpszClassName = className

		if win.RegisterClassEx(&wc) == 0 {
			panic("Failed to register window class")
		}

		hwnd := win.CreateWindowEx(
			0,
			className,
			nil,
			0,
			0, 0, 0, 0,
			win.HWND_MESSAGE, // 🔑 message-only window
			0,
			instance,
			nil,
		)

		if hwnd == 0 {
			panic("Failed to create clipboard window")
		}

		if win.AddClipboardFormatListener(hwnd) == false {
			panic("Failed to add clipboard listener")
		}

		var msg win.MSG
		for win.GetMessage(&msg, 0, 0, 0) > 0 {
			win.TranslateMessage(&msg)
			win.DispatchMessage(&msg)
		}
	}()
}
