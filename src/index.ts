import { setOutput } from '@actions/core';
export enum Tag {
    Security = 'security',
}

export interface Response {
    [major: string]: {
        [minor: string]: {
            announcement: boolean;
            tags: Tag[];
            date: Date;
            source: { filename: string; name: string; sha256: string; date: Date }[];
            version: string;
        };
    };
}

async function run(): Promise<void> {
    const response = await fetch('https://www.php.net/releases/active', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`An error has occurred ${response.status}`);
    }

    const releases = [];
    const data = (await response.json()) as Response;

    for (const [_, versions] of Object.entries(data)) {
        for (const [_, release] of Object.entries(versions)) {
            releases.push({
                version: release.version,
                sources: release.source,
            });
        }
    }

    setOutput('releases', releases);
}

run();
