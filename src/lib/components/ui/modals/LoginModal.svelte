<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/modules/firebase/client';
	import {
		GoogleAuthProvider,
		reauthenticateWithCredential,
		type AuthCredential,
		type UserCredential
	} from 'firebase/auth';
	import { fade } from 'svelte/transition';
	import LoginForm from '../inputs/LoginForm.svelte';

	let container: HTMLElement;
	let isOpen: boolean = false;
	let onLogin: (
		result: string,
		credential?: UserCredential,
		authCredential?: AuthCredential
	) => void;

	/**
	 * Opens the modal
	 * @returns {Promise<boolean>} resolves when the login is completed, returns true if the login was successful, false otherwise
	 */
	export const open = (): Promise<boolean> => {
		console.log('open');

		isOpen = true;

		return new Promise((resolve, reject) => {
			onLogin = async (
				result: string,
				userCredential?: UserCredential,
				authCredential?: AuthCredential
			) => {
				switch (result) {
					case 'success':
						if (userCredential && authCredential) {
							await reauthenticateWithCredential(userCredential.user, authCredential);
						}
						isOpen = false;
						resolve(true);
						break;
					case 'failure':
						isOpen = false;
						resolve(false);
						break;
					case 'next':
						goto('/register/next');
						break;
					default:
						break;
				}
			};
		});
	};
</script>

{#if isOpen && onLogin}
	<div bind:this={container} class="modal modal-open" transition:fade>
		<div class="modal-box flex items-center justify-center">
			<LoginForm {onLogin} />
		</div>
	</div>
{/if}
