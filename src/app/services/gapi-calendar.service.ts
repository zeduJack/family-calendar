import {Injectable} from '@angular/core';
import {gapi} from 'gapi-script';

export type Event = {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
}

export type EventResult = {
    errorOccured?: boolean;
    errorMessage?: string;
    events: Event[];
}

@Injectable({
    providedIn: 'root'
})
export class GapiCalendarService {
    private CLIENT_ID = '433490305066-0831r77lgk08f3h4m7l04sb7ssl3mko0.apps.googleusercontent.com';
    private API_KEY = 'AIzaSyCL91vf3dRkGaw207hOfgLAl1C9sTN0ASk';
    private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
    private SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
    private gapiInitialized = false;

    constructor() {
    }

    // Return a promise that resolves when gapi is initialized
    initClient(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.gapiInitialized) {
                resolve(); // GAPI is already initialized
                return;
            }

            gapi.load('client:auth2', () => {
                gapi.client.init({
                    apiKey: this.API_KEY,
                    clientId: this.CLIENT_ID,
                    discoveryDocs: this.DISCOVERY_DOCS,
                    scope: this.SCOPES,
                }).then(() => {
                    gapi.auth2.getAuthInstance().signIn().then(() => {
                        this.gapiInitialized = true; // Flag that gapi is initialized
                        resolve(); // Resolve the promise after successful initialization
                    }).catch((error: any) => {
                        reject(error); // Handle any errors during the sign-in process
                    });
                }).catch((error: any) => {
                    reject(error); // Handle any errors during the gapi initialization process
                });
            });
        });
    }

    // Ensure gapi is initialized before trying to get events
    async getUpcomingEvents(): Promise<EventResult> {
        try {
            // Ensure gapi is initialized
            await this.initClient();

            const response = await gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            });

            const events = response.result.items;
            const output: Event[] = events.map(
                (event: any): Event => {
                    return {
                        id: event.id,
                        title: event.summary,
                        description: event.description,
                        start: event.start.dateTime || event.start.date,
                        end: event.end.dateTime || event.end.date,
                    }
                });

            return {events: output};
        } catch (err) {
            return {
                events: [],
                errorOccured: true,
                errorMessage: (err as any).toString()
            };
        }
    }
}
