import { writable, type Writable } from 'svelte/store';

export class Steps {
	protected stepsContainer: HTMLElement;
	protected sectionsContainer: HTMLElement;
	steps: HTMLElement[];
	sections: HTMLElement[];
	currentStep: Writable<number>;

	constructor(stepsContainer: HTMLElement, sectionsContainer: HTMLElement, currentStep = 1) {
		this.stepsContainer = stepsContainer;
		this.sectionsContainer = sectionsContainer;
		this.currentStep = writable(currentStep);
		this.steps = Array.from(stepsContainer.children) as HTMLElement[];
		this.sections = Array.from(sectionsContainer.children) as HTMLElement[];

		this.setStepClasses(currentStep);
	}

	protected setStepClasses(currentStep: number) {
		this.steps.forEach((step) => step.classList.remove('step-primary'));
		this.sections.forEach((container) => (container.style.display = 'none'));
		for (let i = 0; i < currentStep; i++) {
			this.steps[i].classList.add('step-primary');
		}
		this.sections[currentStep - 1].style.display = 'flex';
	}

	nextStep() {
		this.currentStep.update((currentStep) => {
			currentStep++;
			currentStep = Math.min(currentStep, this.steps.length);

			this.setStepClasses(currentStep);

			return currentStep;
		});
	}

	prevStep() {
		this.currentStep.update((currentStep) => {
			currentStep--;
			currentStep = Math.max(currentStep, 1);

			this.setStepClasses(currentStep);

			return currentStep;
		});
	}
}
