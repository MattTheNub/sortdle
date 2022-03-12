import { readFileSync } from 'fs'
import path from 'path'

export const allowedWords = new Set(
	readFileSync(
		path.join(__dirname, '..', 'assets', 'allowed.txt'),
		'utf-8',
	).split('\n'),
)

export const answers = readFileSync(
	path.join(__dirname, '..', 'assets', 'answers.txt'),
	'utf-8',
).split('\n')
