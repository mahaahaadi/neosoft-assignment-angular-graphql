import { Component, OnInit, inject, WritableSignal, signal } from '@angular/core';
import { Character, CharactersService } from '../characters.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  standalone: true,
  imports: [RouterLink]
})
export class BrowseComponent implements OnInit {
  // Using signals for better reactivity
  offset: WritableSignal<number> = signal(0);
  count: WritableSignal<number> = signal(0);
  characters: WritableSignal<Character[]> = signal([]);

  // Using dependency injection with Angular's `inject`
  private charactersService = inject(CharactersService);

  async ngOnInit(): Promise<void> {
    await this.updateCharacters();
  }

  async updateCharacters() {
    const result = await this.charactersService.getCharacters(this.offset());
    this.count.set(result.count);
    this.characters.set(result.characters);
  }

  showPrevious() {
    return this.offset() > 0;
  }

  showNext() {
    return this.offset() + 10 < this.count();
  }

  async onPrevious() {
    this.offset.update((value) => value - 10);
    await this.updateCharacters();
  }

  async onNext() {
    this.offset.update((value) => value + 10);
    await this.updateCharacters();
  }
}
