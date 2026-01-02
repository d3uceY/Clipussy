package clipboard

import (
	"syscall"

	"github.com/lxn/win"
)
// to install the third party APIs for win#@, use cli command <<< go get github.com/lxn/win >>>
var (
	user32                   = syscall.NewLazyDLL("user32.dll")
	addClipboardFormatListener = user32.NewProc("AddClipboardFormatListener")
	removeClipboardFormatListener = user32.NewProc("RemoveClipboardFormatListener")
)

const WM_CLIPBOARDUPDATE = 0x031D

func StartClipboardListener(onChange func()) {
	go func() {
		className, _ := syscall.UTF16PtrFromString("STATIC")
		windowName, _ := syscall.UTF16PtrFromString("ClipussyClipboardListener")
		hwnd := win.CreateWindowEx(
			0,
			className,
			windowName,
			0,
			0, 0, 0, 0,
			0,
			0,
			0,
			nil,
		)

		addClipboardFormatListener.Call(uintptr(hwnd))

		var msg win.MSG
		for {
			win.GetMessage(&msg, 0, 0, 0)

			if msg.Message == WM_CLIPBOARDUPDATE {
				onChange()
			}

			win.TranslateMessage(&msg)
			win.DispatchMessage(&msg)
		}
	}()
}
