export class Steps {
    protected stepsContainer: HTMLElement;
    protected sectionsContainer: HTMLElement;
    steps: HTMLElement[];
    sections: HTMLElement[];
    currentStep: number;

    constructor(stepsContainer: HTMLElement, sectionsContainer: HTMLElement, currentStep = 1) {
        this.stepsContainer = stepsContainer;
        this.sectionsContainer = sectionsContainer;
        this.currentStep = currentStep;
        this.steps = Array.from(stepsContainer.children) as HTMLElement[];
        this.sections = Array.from(sectionsContainer.children) as HTMLElement[];

        this.setStepClasses();
    }

    protected setStepClasses() {
        this.steps.forEach((step) => step.classList.remove('step-primary'));
        this.sections.forEach((container) => container.classList.add('hidden'));
        for (let i = 0; i < this.currentStep; i++) {
            this.steps[i].classList.add('step-primary');
        }
        this.sections[this.currentStep - 1].classList.remove('hidden');
    }

    nextStep() {
        this.currentStep = this.currentStep + 1;
        this.currentStep = Math.min(this.currentStep, this.steps.length);

        this.setStepClasses();
    }

    prevStep() {
        this.currentStep = this.currentStep - 1;
        this.currentStep = Math.max(this.currentStep, 1);
        this.setStepClasses();
    }
}