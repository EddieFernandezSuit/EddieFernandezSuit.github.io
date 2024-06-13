export class Gist {
    constructor(gistId) {
        this.gistId = gistId;
        this.gistApiKey = process.env.GIST_KEY;
        this.gistApiUrl = `https://api.github.com/gists/${this.gistId}`;
    }

    async get(fileName) {
        try {
            const response = await fetch(this.gistApiUrl);
            const gistData = await response.json();
            return csvToObject(gistData.files[fileName].content);
        } catch (error) {
            console.error('Error loading data from Gist:', error);
            return [];
        }
    }

    async save(data, fileName) {
        const csvContent = ObjectToCSV(data);
        try {
            await fetch(this.gistApiUrl, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + this.gistApiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    files: {
                        [fileName]: {
                            content: csvContent,
                        },
                    },
                }),
            });
        } catch (error) {
            console.error('Error saving data to Gist:', error);
        }
    }
}

const ObjectToCSV = (data) => {
    if (!data.length) return '';

    const header = Object.keys(data[0]);
    return `${header.join(',')}\n${data.map(obj => header.map(key => obj[key] || '').join(',')).join('\n')}`;
};

function csvToObject(csvString) {
    const [header, ...rows] = csvString.trim().split('\n');
    const headers = header.split(',');
    return rows.map(row => {
        const values = row.split(',');
        return Object.fromEntries(headers.map((key, index) => [key, values[index]]));
    });
}