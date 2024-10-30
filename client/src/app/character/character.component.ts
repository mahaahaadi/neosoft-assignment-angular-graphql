import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private characterService: CharactersService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.character = await this.characterService.findCharacter(params['name']);
      console.log(this.character.description);
      
    });
  }

  async deleteUser(name: string) {
    const result = await this.characterService.deleteCharacter(name).then((message) => {
      this.router.navigate(['/browse']);
      // Optionally, refetch or update local data to reflect the change.
    });
  }

}