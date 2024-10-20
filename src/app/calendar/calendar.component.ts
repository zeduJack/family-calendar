import { Component } from '@angular/core';
import {of} from "rxjs";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  protected readonly of = of;
  times: { label: string, top: number }[] = Array.from({ length: 24 }, (_, i) => ({
    label: `${i.toString().padStart(2, '0')}:00`,
    top: i * 60
  }));
}
