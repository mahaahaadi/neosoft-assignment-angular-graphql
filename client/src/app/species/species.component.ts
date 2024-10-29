import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { CharactersService, Species } from '../characters.service';
RouterModule
@Component({
  selector: 'app-species',
  templateUrl: './species.component.html',
  styleUrls: ['./species.component.scss'],
  standalone:true,
  imports:[RouterLink]
})
export class SpeciesComponent implements OnInit {
  species!: Species;

  constructor(private route: ActivatedRoute, private characterService: CharactersService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.species = await this.characterService.findSpecies(params['name']);
    });
  }
}