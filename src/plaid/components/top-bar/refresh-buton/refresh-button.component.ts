import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

/**
 * Dumb component, presents button, handles refresh shortcuts, and delegates refresh action
 */
@Component({
  selector: 'plaid-refresh-button',
  templateUrl: './refresh-button.component.html'
})
export class RefreshButtonComponent implements OnInit {
  @Input()
  disabled = false;
  @Input()
  shortcutsDisabled = false;
  @Output()
  refresh = new EventEmitter<void>();
  @ViewChild('button', {static: true})
  button: ElementRef;
  buttonActive = false;

  ngOnInit(): void {
    // Singleton component, no need to unbind
    addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.key === 'F5' || e.key.toLowerCase() === 'r' && e.ctrlKey) && !this.shortcutsDisabled && !e.repeat) {
        this.buttonActive = true;
        this.button.nativeElement.click();
        setTimeout(() => this.buttonActive = false, 50);
      }
    });
  }

  doRefresh(): void {
    if (!this.disabled) {
      this.refresh.emit();
    }
  }
}
