<script setup lang="ts">
import { open } from '@tauri-apps/api/dialog'
import { computed, ref } from 'vue'
import { generateBatFile } from './bat'

const copyIn = ref(false)
const showFinished = ref(false)
const myGamesHmSave = ref('')
const copyInHmSave = ref('')
const showGenerateButton = computed(() => {
	if (copyIn.value) {
		if (myGamesHmSave.value && copyInHmSave.value) {
			return true
		}
		return false
	}
	if (myGamesHmSave.value) {
		return true
	}
	return false
})

async function openDirectory() {
	const selected = await open({
		directory: true,
		defaultPath: 'C:/Users/%userprofile%/Documents/My Games'
	})
	if (selected && typeof selected === 'string') {
		return selected
	}
	return ''
}

async function hotlineSaveFileClicked() {
	myGamesHmSave.value = await openDirectory()
}

async function copyInFileClicked() {
	copyInHmSave.value = await openDirectory()
}

async function generateClicked() {
	await generateBatFile(copyIn.value, myGamesHmSave.value, copyInHmSave.value)
	showFinished.value = true
}
</script>

<template>
	<div class="tw-flex-col h-[100vh] items-center justify-center gap-5 p-4">
		<div class="flex items-center">
			<input v-model="copyIn" type="checkbox" class="tw-checkbox" />
			<label class="ml-2">Copy in an existing save file?</label>
		</div>

		<div class="tw-card-div">
			<div class="tw-highlted-text-div">
				Example:
				<p class="tw-highlighted-text">
					C:\Users\buffet\Documents\My Games\HotlineMiami
				</p>
			</div>

			<button
				class="tw-button"
				@click="hotlineSaveFileClicked"
				@submit="hotlineSaveFileClicked"
			>
				Hotline Miami save folder
			</button>
			<div v-if="myGamesHmSave" class="tw-highlted-text-div">
				Folder selected:
				<p class="tw-highlighted-text">
					{{ myGamesHmSave }}
				</p>
			</div>
		</div>

		<div v-if="copyIn" class="tw-card-div">
			<div class="tw-highlted-text-div">
				Example:
				<p class="tw-highlighted-text">F:\Games\Hotline\ngPlusNoCharlie</p>
			</div>
			<button
				class="tw-button"
				@click="copyInFileClicked"
				@submit="copyInFileClicked"
			>
				Pre-existing save folder
			</button>
			<div v-if="copyInHmSave" class="tw-highlted-text-div">
				Folder selected:

				<p class="tw-highlighted-text">
					{{ copyInHmSave }}
				</p>
			</div>
		</div>

		<div v-if="showGenerateButton" class="tw-card-div">
			<label>Downloaded to your download folder</label>
			<button
				class="tw-button"
				@click="generateClicked"
				@submit="generateClicked"
			>
				Generate Bat file
			</button>
		</div>

		<p v-if="showFinished" class="tw-card font-bold text-green-500">
			Bat file created!
		</p>
	</div>
</template>
