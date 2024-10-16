import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventResult, GapiCalendarService } from "./services/gapi-calendar.service";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'family-calendar';

    protected eventResult?: EventResult;

    readonly gapiService = inject(GapiCalendarService);

    ngOnInit(): void {
        this.getEvents();
    }

    async getEvents() {
        try {
            this.eventResult = await this.gapiService.getUpcomingEvents();
        } catch (error) {
            console.error('Error initializing GAPI or fetching events:', error);
        }
    }
}
