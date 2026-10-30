export interface Track {
  id: string
  title: string
  artist: string
  version: string
  src: string
  durationFormatted: string
}

export const TRACKS: Track[] = [
  {
    id: 'higher',
    title: 'Higher',
    artist: 'ICF Worship',
    version: 'Piano Instrumental',
    src: '/music/ICF_Worship_-_Higher_Piano_Instrumental__CeeNaija.com_.mp3',
    durationFormatted: '4:23',
  },
  {
    id: 'this-is-my-jesus',
    title: 'This Is My Jesus',
    artist: 'ICF Worship',
    version: 'Piano Instrumental',
    src: '/music/ICF_Worship_-_This_Is_My_Jesus_Piano_Instrumental__CeeNaija.com_.mp3',
    durationFormatted: '4:20',
  },
  {
    id: 'to-know-you',
    title: 'To Know You',
    artist: 'ICF Worship',
    version: 'Piano Instrumental',
    src: '/music/ICF_Worship_-_To_Know_You_Piano_Instrumental__CeeNaija.com_.mp3',
    durationFormatted: '4:38',
  },
  {
    id: 'peace',
    title: 'Peace',
    artist: 'Moments of Worship',
    version: 'Soaking Instrumental',
    src: '/music/Moments_of_Worship_-_Peace_Instrumental_Soaking_Worship_CeeNaija.com_.mp3',
    durationFormatted: '1:19:25',
  },
  {
    id: 'ruach',
    title: 'Ruach',
    artist: 'Soaking Worship',
    version: 'Atmospheric Instrumental',
    src: '/music/Soaking-Worship-Ruach-(CeeNaija.com).mp3',
    durationFormatted: '5:50',
  },
]

