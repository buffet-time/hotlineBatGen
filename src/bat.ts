import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'

function generateBat(
	hotlineDirectory: string,
	copyIn: boolean,
	copyDirectory?: string
) {
	if (copyIn && copyDirectory) {
		return `@ECHO OFF\ndel "${hotlineDirectory}"\ncopy "${copyDirectory}\\SaveData.sav" "${hotlineDirectory}\\"`
	}

	// just delete
	return `@ECHO OFF\ndel "${hotlineDirectory}\\SaveData.sav"`
}

export async function generateBatFile(
	copyIn: boolean,
	myGamesHmSave: string,
	copyInHmSave?: string
) {
	console.log(copyIn, myGamesHmSave, copyInHmSave)
	if (copyIn) {
		await writeTextFile(
			'hotlineMiamiBatDeleteAndCopy.bat',
			generateBat(myGamesHmSave, true, copyInHmSave),
			{ dir: BaseDirectory.Download }
		)
	} else {
		await writeTextFile(
			'hotlineMiamiBatJustDelete.bat',
			generateBat(myGamesHmSave, false),
			{
				dir: BaseDirectory.Download
			}
		)
	}
}

// Example
// @ECHO OFF
// del "C:\Users\radd8\Documents\My Games\HotlineMiami\SaveData.sav"
// copy "C:\Users\radd8\Documents\My Games\HotlineMiami\test12\SaveData.sav" "C:\Users\radd8\Documents\My Games\HotlineMiami\"
