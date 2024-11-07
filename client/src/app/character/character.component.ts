import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CharacterDetail, CharactersService } from '../characters.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-character',
  standalone: true,
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  imports: [RouterLink, FormsModule, ReactiveFormsModule]
})

export class CharacterComponent implements OnInit {
  character!: CharacterDetail;
  private modalService = inject(NgbModal);
  closeResult = '';
  characterForm!: FormGroup;
  private modalRef: NgbModalRef | null = null; // Store the modal reference

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private characterService: CharactersService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.characterForm = this.fb.group({
      height: [''],
      mass: [''],
      hair_color: [''],
      skin_color: [''],
      eye_color: [''],
      birth_year: [''],
      gender: [''],
      description: [''],
    });

    this.route.queryParams.subscribe(async (params) => {
      this.character = await this.characterService.findCharacter(params['name']);
    });
  }

  loadCharacterData() {
    const character = this.character;
    this.characterForm.patchValue({
      height: character.height,
      mass: character.mass,
      hair_color: character.hair_color,
      skin_color: character.skin_color,
      eye_color: character.eye_color,
      birth_year: character.birth_year,
      gender: character.gender,
      description: character.description,
    });
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  async deleteUser(name: string) {
    const result = await this.characterService.deleteCharacter(name).then((message) => {
      this.toastrService.success(message, "Success", {
        closeButton: true,
        timeOut: 2500,
        positionClass: 'toast-center-center'
      });
      this.router.navigate(['/browse']);
    });
  }

  async updateUser(id: string) {
    const updatedObj = this.characterForm.value;

    try {
      const result = await this.characterService.updateCharacter(id, updatedObj);
      console.log(updatedObj);
      this.toastrService.success(result.message, "Success", {
        closeButton: true,
        timeOut: 2500,
        positionClass: 'toast-center-center'
      });
      if (this.modalRef) {
        this.modalRef.close(); // Close the modal after successful update
      }
      this.router.navigate(['/browse']);
    } catch (error) {
      console.error('Error updating character:', error);
      this.toastrService.error('Failed to update character. Please try again.', "Error", {
        closeButton: true,
        timeOut: 3000,
        positionClass: 'toast-center-center'
      });
    }
  }
}
