import _ from 'underscore';
import { Type } from 'class-transformer';
import { plainToClass } from 'class-transformer';

export class Settings {
    @Type(() => Library)
    libraries: Library[] = [];

    get hasLibraries(): boolean {
        return this.libraries.length > 0;
    }

    sort(): void {
        this.libraries = _.sortBy(this.libraries, x => x.sortKey);
    }

    isFavourite(code: string): boolean {
        const found = _.find(this.libraries, x => x.code == code);
        return found.favourite;
    }

    save(): void {
        localStorage.setItem('settings', JSON.stringify(this));
    }

    static load(): Settings {
        const existing = localStorage.getItem('settings');

        if (existing) {
            return plainToClass(Settings, JSON.parse(existing));
        }

        const created = new Settings();
        created.save();
        return created;
    }
}

export class Library {
    name: string;
    code: string;
    favourite: boolean;

    get sortKey(): string {
        let key = this.name;

        // Some libraries prefix their names - e.g. "(CBA) Bamber Bridge"
        const match = /^\([A-Z0-9]{3}\) (.+)/.exec(this.name);

        if (match?.length ?? 0 > 0) {
            // Remove the prefix
            key = match[1];
        }

        // Show available copies above copies that are on loan.
        return `${this.favourite ? 0 : 1}-${key}`;
    }
}