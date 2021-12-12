export class ServiceResult {
    service: string;
    code: string;
    items: AvailabilityResult[];
    favourite: boolean;

    constructor(
        service: string,
        code: string,
        favourite: boolean
    ) {
        this.service = service;
        this.code = code;
        this.favourite = favourite;
    }

    get sortKey(): string {
        return `${this.favourite ? 0 : 1}-${this.service}`;
    }
}

export class AvailabilityResult {
    library: string;
    available: number;
    total: number;
    url: string;
    isbn: string;

    constructor(url: string,
        library: string,
        available: number,
        total: number,
        isbn: string
    ) {
        this.url = url;
        this.library = library;
        this.available = available;
        this.total = total;
        this.isbn = isbn;
    }

    get sortKey(): string {
        let library = this.library;

        // Some libraries prefix their names - e.g. "(CBA) Bamber Bridge"
        const match = /^\([A-Z0-9]{3}\) (.+)/.exec(library);

        if (match?.length ?? 0 > 0) {
            // Remove the prefix
            library = match[1];
        }

        // Show available copies above copies that are on loan.
        return `${this.available > 0 ? 0 : 1}-${library}`;
    }
}