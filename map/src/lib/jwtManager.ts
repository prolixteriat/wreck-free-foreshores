
// -----------------------------------------------------------------------------

export class JwtManager {

    private readonly storageKey = 'jwt';

    private token: string;
    private expires: Date;
    private role: string;
    private username: string;

    constructor() {
        this.token = '';
        this.expires = new Date();
        this.role = '';
        this.username = '';
        this.readToken();
    }

    public getRole(): string {
        return this.role;
    }
    
    public getToken(): string {
        return this.token;
    }

    public getUsername(): string {
        return this.username;
    }

    private init() {
        this.token = '';
        this.expires = new Date();
        this.role = '';
        this.username = '';
    }
    public isCurrent(): boolean {
        return !this.isExpired();
    }

    public isExpired(): boolean {
        return this.expires < new Date();
    }

    public isAdmin(): boolean {
        return this.role === 'admin';
    }

    public isLoggedIn(): boolean {
        return (this.username.length) > 0 && this.isCurrent();
    }

    public isLoggedOut(): boolean {
        return !this.isLoggedIn();
    }

    public logOut(): void {
        localStorage.removeItem(this.storageKey);
        this.init();
        return;
    }

    private parseToken(): void {
        const arrayToken = this.token.split('.');
        if (arrayToken.length !== 3) {
            return;
        }
		const tokenPayload = JSON.parse(atob(arrayToken[1]));
        this.expires = new Date(tokenPayload.exp * 1000);
        this.username = tokenPayload.sub;
        this.role = tokenPayload.role;
    }

    public readToken(): void {
        this.token = localStorage.getItem(this.storageKey) || '';
        this.parseToken();
    }

    public writeToken(token: string) {
        localStorage.setItem(this.storageKey, token);
        this.readToken();
    }
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

