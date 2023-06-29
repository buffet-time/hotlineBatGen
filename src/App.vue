<script setup lang="ts">
import { open } from '@tauri-apps/api/dialog'
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import { computed, ref } from 'vue'

const copyIn = ref(false)
const myGamesHmSave = ref('')
const copyInHmSave = ref('')
const showGenerateButton = computed(() => {
	if (copyIn.value && myGamesHmSave && copyInHmSave) {
		return true
	} else if (myGamesHmSave.value) {
		return true
	}
	return false
})

function generateBat(deleteFile: string, copyIn: boolean, copyFile?: string) {
	if (copyIn && copyFile) {
		return `@ECHO OFF\ndel "${deleteFile}"\ncopy "${copyIn}" "${deleteFile}"`
	}

	// just delete
	return `@ECHO OFF\ndel "${deleteFile}"`
}

async function openFile() {
	const selected = await open({
		multiple: false,
		filters: [
			{
				name: 'Hotline Save File',
				extensions: ['sav']
			}
		],
		defaultPath: 'C:/Users/%userprofile%/Documents/My Games/HotlineMiami'
	})
	if (selected && typeof selected === 'string') {
		// console.log(selected)
		return selected
	}
	return ''
}

async function hotlineSaveFileClicked() {
	myGamesHmSave.value = await openFile()
}

async function copyInFileClicked() {
	copyInHmSave.value = await openFile()
}

async function generateBatFile() {
	if (copyIn.value) {
		await writeTextFile(
			'hotlineMiamiBatJustDelete.bat',
			generateBat(myGamesHmSave.value, true, copyInHmSave.value),
			{ dir: BaseDirectory.Download }
		)
	} else {
		await writeTextFile(
			'hotlineMiamiBatDeleteAndCopy.bat',
			generateBat(myGamesHmSave.value, false),
			{
				dir: BaseDirectory.Download
			}
		)
	}
}
</script>

<template>
	<div class="tw-flex-col h-[100vh] items-center justify-center gap-5 p-4">
		<div>
			<input v-model="copyIn" type="checkbox" />
			<label>Copy in an existing save file?</label>
		</div>

		<div class="tw-flex-col items-center">
			<label
				>Example: C:\Users\buffet\Documents\My
				Games\HotlineMiami\SaveData.sav</label
			>
			<button
				class="tw-button mt-2"
				@click="hotlineSaveFileClicked"
				@submit="hotlineSaveFileClicked"
			>
				Hotline Miami save file
			</button>
		</div>

		<div v-if="copyIn" class="tw-flex-col">
			<label>Example: F:\Games\Hotline\</label>
			<button
				class="tw-button mt-2"
				@click="copyInFileClicked"
				@submit="copyInFileClicked"
			>
				Pre-existing save file
			</button>
		</div>

		<div v-if="showGenerateButton" class="tw-flex-col">
			<label>Downloaded to your download folder</label>
			<button
				class="tw-button"
				@click="generateBatFile"
				@submit="generateBatFile"
			>
				Generate Bat file
			</button>
		</div>
	</div>
</template>
