import { LetterColor } from './state'

export function getColorClass(color: LetterColor | null) {
	switch (color) {
		case LetterColor.Blue:
			return 'letter-blue'

		case LetterColor.Green:
			return 'letter-green'

		case LetterColor.Yellow:
			return 'letter-yellow'

		case LetterColor.Grey:
			return 'letter-grey'

		case null:
			return 'letter-blank'
	}
}

export function isMobile() {
	return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(
		navigator.userAgent,
	)
}
