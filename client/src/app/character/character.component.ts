import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CharacterDetail, CharactersService } from '../characters.service';

@Component({
  selector: 'app-character',
  standalone:true,
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  imports:[RouterLink]
})
export class CharacterComponent implements OnInit {
  character!: CharacterDetail;

  constructor(private route: ActivatedRoute, private characterService: CharactersService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.character = await this.characterService.findCharacter(params['name']);
    });
  }
}