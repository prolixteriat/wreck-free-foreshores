
// -----------------------------------------------------------------------------

export class MapPref {

    private readonly defBase = 'Terrain';
    private readonly defZoom = 14;

    private readonly keyBase = 'map_base';
    private readonly keyZoom = 'map_zoom';

    private base: string;
    private zoom: number;

    constructor() {
        this.base = this.defBase;
        this.zoom = this.defZoom;
        this.readKeys();
    }

    public getBase(): string {
        return this.base;
    }
    
    public getZoom(): number {
        return this.zoom;
    }

    public setBase(base: string): void {
        this.base = base;
        this.writeKeys();
    }

    public setZoom(zoom: number): void {
        this.zoom = zoom;
        this.writeKeys();
    }

    public readKeys(): void {
        this.base = localStorage.getItem(this.keyBase) || this.defBase;
        this.zoom = parseInt(localStorage.getItem(this.keyZoom) || this.defZoom.toString());
    }

    public writeKeys(): void {
        localStorage.setItem(this.keyBase, this.base.toString());
        localStorage.setItem(this.keyZoom, this.zoom.toString());
    }
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

