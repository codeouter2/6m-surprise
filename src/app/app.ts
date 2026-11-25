import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  protected readonly title = signal('our-six-months');

  // --- VALIDATION TARGET: 2 JUNE 2026 AT 02:30 PM ---
  expectedDate = '2026-06-02';
  expectedHour = 2;
  expectedMinute = 30;
  expectedPeriod: 'AM' | 'PM' = 'PM';

  // Selected values
  meetingDate = signal<string>('');
  meetingTime = signal<string>('12:00 PM');

  // --- CUSTOM CALENDAR STATE (Opens on June 2026) ---
  showCalendar = signal<boolean>(false);
  viewYear = signal<number>(2026);
  viewMonth = signal<number>(1); // 0 = Jan, 5 = June
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  calendarDays = computed(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  });

  // --- CUSTOM ANALOG WATCH STATE ---
  showClock = signal<boolean>(false);
  clockMode = signal<'hour' | 'minute'>('hour');
  selectedHour = signal<number>(12);
  selectedMinute = signal<number>(0);
  selectedPeriod = signal<'AM' | 'PM'>('PM');

  hoursDial = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  minutesDial = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  handRotation = computed(() => {
    if (this.clockMode() === 'hour') {
      return (this.selectedHour() % 12) * 30;
    } else {
      return this.selectedMinute() * 6;
    }
  });

  // --- STAGE & SURPRISE FLOW STATES ---
  // Steps: 'timeline' | 'gift-box' | 'ribbon-letter' | 'open-letter' | 'video'
  currentStage = signal<'timeline' | 'gift-box' | 'ribbon-letter' | 'open-letter' | 'video'>('timeline');
  relationshipStage = signal<number>(0);
  errorMessage = signal<string>('');

  isBoxOpened = signal<boolean>(false);
  isRibbonUntying = signal<boolean>(false);

  // --- TYPEWRITER STATE ---
  letterTitle = 'आमच्या ६ महिन्यांचा प्रवास ❤️';
  fullLetterBody = `२ जून २०२६ रोजी दुपारी २:३० वाजता आपण पहिल्यांदा online भेटलो आणि तिथूनच आपल्या आयुष्यातला एक सुंदर अध्याय सुरू झाला.

अनपेक्षितपणे ओळख झालेली ती दोन मनं हळूहळू इतकी जवळ आली की आज सहा महिने कधी उलटून गेले ते कळलंच नाही. आपलं प्रत्येक हसणं, प्रत्येक गप्पा आणि एकत्र घालवलेला प्रत्येक क्षण माझ्यासाठी खूप खास आहे. मला माहित आहे मी तुला कधी कधी खूप रडवलंही आहे, पण खरंच माझा तसा कोणताही हेतू नव्हता. पुढेही प्रत्येक क्षण मला तुझ्यासोबतच घालवायचा आहे.

मी तुला वचन देतो की तुझी साथ मी कधीच सोडणार नाही आणि तुला नेहमी खुश ठेवण्याचा प्रत्येक प्रयत्न करत राहीन. तू माझ्या आयुष्यात आल्यापासून प्रत्येक दिवस अधिक सुंदर झाला आहे.

हा छोटासा व्हिडिओ आपल्या या सहा महिन्यांच्या प्रवासाची एक गोड आठवण म्हणून...

तू मला साथ देणार ना...`;

  typedLetterText = signal<string>('');
  isTypingDone = signal<boolean>(false);
  private typewriterTimer: ReturnType<typeof setInterval> | null = null;

  stageLabels = [
    { title: 'Two Unknown Strangers', emoji: '👀', desc: 'Just two people crossing paths...' },
    { title: 'Getting to Know You', emoji: '💬', desc: 'Endless talks and first laughs.' },
    { title: 'My Favorite Person', emoji: '✨', desc: 'Every day started feeling brighter.' },
    { title: '6 Months Together ❤️', emoji: '💑', desc: 'From unknown to my whole world.' },
  ];

  // --- CALENDAR METHODS ---
  prevMonth(): void {
    if (this.viewMonth() === 0) {
      this.viewMonth.set(11);
      this.viewYear.update((y) => y - 1);
    } else {
      this.viewMonth.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.viewMonth() === 11) {
      this.viewMonth.set(0);
      this.viewYear.update((y) => y + 1);
    } else {
      this.viewMonth.update((m) => m + 1);
    }
  }

  selectCalendarDay(day: number | null): void {
    if (!day) return;
    const m = String(this.viewMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    this.meetingDate.set(`${this.viewYear()}-${m}-${d}`);
    this.errorMessage.set('');
    this.showCalendar.set(false);
  }

  isSelectedDay(day: number | null): boolean {
    if (!day || !this.meetingDate()) return false;
    const m = String(this.viewMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return this.meetingDate() === `${this.viewYear()}-${m}-${d}`;
  }

  formattedDateDisplay(): string {
    if (!this.meetingDate()) return 'Tap to pick our special date';
    const [y, m, d] = this.meetingDate().split('-').map(Number);
    return `${d} ${this.monthNames[m - 1]} ${y}`;
  }

  // --- CLOCK METHODS ---
  selectHour(hour: number): void {
    this.selectedHour.set(hour);
    this.updateFormattedTime();
    setTimeout(() => this.clockMode.set('minute'), 250);
  }

  selectMinute(minute: number): void {
    this.selectedMinute.set(minute);
    this.updateFormattedTime();
  }

  togglePeriod(period: 'AM' | 'PM'): void {
    this.selectedPeriod.set(period);
    this.updateFormattedTime();
  }

  updateFormattedTime(): void {
    const h = String(this.selectedHour()).padStart(2, '0');
    const m = String(this.selectedMinute()).padStart(2, '0');
    this.meetingTime.set(`${h}:${m} ${this.selectedPeriod()}`);
    this.errorMessage.set('');
  }

  getDialPosition(index: number): { left: string; top: string } {
    const angleDeg = index * 30 - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const radius = 84;
    const center = 105;
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);
    return { left: `${x}px`, top: `${y}px` };
  }

  // --- STAGE 1 VALIDATION ---
  updateStage(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.relationshipStage.set(value);
    this.errorMessage.set('');
  }

  startStory(): void {
    if (!this.meetingDate()) {
      this.errorMessage.set('Pick our special date on the calendar first 📅');
      return;
    }

    if (this.meetingDate() !== this.expectedDate) {
      this.errorMessage.set('Not quite that date! Think back to early June 2026 📅');
      return;
    }

    const timeMatches =
      this.selectedHour() === this.expectedHour &&
      this.selectedMinute() === this.expectedMinute &&
      this.selectedPeriod() === this.expectedPeriod;

    if (!timeMatches) {
      this.errorMessage.set('Check the watch time again! Hint: Afternoon around 2:30 PM 🕰️');
      return;
    }

    if (this.relationshipStage() < 3) {
      this.errorMessage.set('Slide our journey all the way to the right! 👉');
      return;
    }

    this.errorMessage.set('');
    this.currentStage.set('gift-box');
  }

  // --- STAGE 2: OPEN BOX -> RIBBON LETTER -> TYPEWRITER -> VIDEO ---
  openGiftBox(): void {
    if (this.isBoxOpened()) return;
    this.isBoxOpened.set(true);

    setTimeout(() => {
      this.currentStage.set('ribbon-letter');
    }, 850);
  }

  untieRibbonAndRead(): void {
    if (this.isRibbonUntying()) return;
    this.isRibbonUntying.set(true);

    setTimeout(() => {
      this.currentStage.set('open-letter');
      this.startTypewriter();
    }, 750);
  }

  startTypewriter(): void {
    // Use Array.from so Marathi Devanagari conjunct characters don't split awkwardly
    const chars = Array.from(this.fullLetterBody);
    let index = 0;
    this.typedLetterText.set('');
    this.isTypingDone.set(false);

    this.typewriterTimer = setInterval(() => {
      if (index < chars.length) {
        this.typedLetterText.update((prev) => prev + chars[index]);
        index++;
      } else {
        this.finishTyping();
      }
    }, 38); // Speed in ms per character
  }

  skipTypewriter(): void {
    if (this.isTypingDone()) return;
    this.typedLetterText.set(this.fullLetterBody);
    this.finishTyping();
  }

  private finishTyping(): void {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    this.isTypingDone.set(true);
  }

  playGiftVideo(): void {
    this.currentStage.set('video');
  }

  ngOnDestroy(): void {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
    }
  }
}