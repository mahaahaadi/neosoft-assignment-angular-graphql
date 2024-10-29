import { Component, OnInit } from '@angular/core';
import { Character, CharactersService } from '../characters.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  standalone: true,
  imports:[RouterLink]
})
export class BrowseComponent implements OnInit {
  offset: number = 0;
  count: number = 0;
  characters: Character[] = [];

  constructor(private charactersService: CharactersService) {}

  async ngOnInit(): Promise<void> {
    await this.updateCharacters();
  }

  async updateCharacters() {
    const result = await this.charactersService.getCharacters(this.offset);
    this.count = result.count;
    this.characters = result.characters;
  }

  showPrevious() {
    return this.offset > 0;
  }

  showNext() {
    return this.offset + 10 < this.count;
  }

  async onPrevious() {
    this.offset -= 10;
    await this.updateCharacters();
  }

  async onNext() {
    this.offset += 10;
    await this.updateCharacters();
  }
}