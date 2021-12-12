window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later.
    PwaInstaller.set(e);
});

export default class PwaInstaller {
    private static deferredPrompt = null;
    private static handlers: { (isInstalled: boolean): void; }[] = [];

    static addEventListener(func: { (isInstalled: boolean): void; }): void {
        PwaInstaller.handlers.push(func);
    }

    static set(prompt: unknown): void {
        PwaInstaller.deferredPrompt = prompt;
        PwaInstaller.notify();
    }

    static notify(): void {
        PwaInstaller.handlers.forEach(x => x(PwaInstaller.deferredPrompt == null));
    }

    static get isInstalled(): boolean {
        return PwaInstaller.deferredPrompt == null;
    }

    static get isStandalone(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches;
    }

    static install(): void {
        const temp = PwaInstaller.deferredPrompt;
        PwaInstaller.deferredPrompt = null;
        PwaInstaller.notify();
        temp.prompt();
    }
}