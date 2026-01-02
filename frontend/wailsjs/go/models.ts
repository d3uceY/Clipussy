export namespace main {
	
	export class Clip {
	    id: string;
	    content: string;
	    length: number;
	    isPinned: boolean;
	    createdAt: string;
	
	    static createFrom(source: any = {}) {
	        return new Clip(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.content = source["content"];
	        this.length = source["length"];
	        this.isPinned = source["isPinned"];
	        this.createdAt = source["createdAt"];
	    }
	}

}

