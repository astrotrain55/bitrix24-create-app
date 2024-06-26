import { Component, Input } from '@angular/core';
import { BitrixService } from '../../services/bitrix.service';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [],
  templateUrl: './link.component.html',
})
export class LinkComponent {
  @Input({ required: true }) public href: string;

  constructor(private bitrixService: BitrixService) {}

  onClick(e: MouseEvent) {
    e.preventDefault();
    this.bitrixService.BX24.openLink(this.href);
  }

  onMiddleClick(e: MouseEvent) {
    e.preventDefault();
    this.bitrixService.BX24.openLink(this.href, true);
  }
}
