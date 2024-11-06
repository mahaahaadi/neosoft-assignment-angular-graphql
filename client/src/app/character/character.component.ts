import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CharacterDetail, CharactersService } from '../characters.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-character',
  standalone:true,
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  imports:[RouterLink]
})

export class CharacterComponent implements OnInit {
  character!: CharacterDetail;

  constructor(private route: ActivatedRoute, private characterService: CharactersService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.character = await this.characterService.findCharacter(params['name']);
      
    });
  }

  async deleteUser(name: string) {
    this.toastrService.success(`${name} deleted!`, "Success");
    const result = await this.characterService.deleteCharacter(name).then((message) => {
      this.router.navigate(['/browse']);
    });
  }

  //  async editUser(name: string) {
  //   const result = await this.characterService.deleteCharacter(id).then((message) => {
  //     this.router.navigate(['/browse']);
  //     // Optionally, refetch or update local data to reflect the change.
  //   });
  // }


}