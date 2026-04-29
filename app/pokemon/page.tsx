'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PokemonOption {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string
    other: {
      'official-artwork': { front_default: string }
    }
  }
}

const POKEMON_LIST = [
  'bulbasaur',
  'charmander',
  'squirtle',
  'pikachu',
  'mewtwo',
  'gengar',
]

export default function PokemonSelect() {
  const [pokemonData, setPokemonData] = useState<PokemonOption[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<PokemonOption | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        POKEMON_LIST.map((name) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) =>
            res.json(),
          ),
        ),
      )
      setPokemonData(results)
    }
    fetchData()
  }, [])

  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-50 p-8 gap-8'>
      <Link
        href='/'
        className='text-blue-600 hover:text-blue-800 transition-colors underline font-medium'
      >
        ← 回到首頁
      </Link>

      {/* 下拉選單容器 */}
      <div className='relative w-72'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='w-full flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl bg-white shadow-sm hover:border-blue-400 transition-all active:scale-95'
        >
          <div className='flex items-center gap-3'>
            {selected ? (
              <>
                <Image
                  src={selected.sprites.front_default}
                  alt={selected.name}
                  width={32}
                  height={32}
                  unoptimized
                />
                <span className='capitalize font-semibold text-gray-700'>
                  {selected.name}
                </span>
              </>
            ) : (
              <span className='text-gray-400'>請選擇寶可夢...</span>
            )}
          </div>
          <span
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <ul className='absolute z-20 w-full mt-2 border border-gray-100 rounded-xl bg-white shadow-2xl max-h-64 overflow-auto scrollbar-hide'>
            {pokemonData.map((poke) => (
              <li
                key={poke.id}
                onClick={() => {
                  setSelected(poke)
                  setIsOpen(false)
                  setIsFlipped(false) // 更換寶可夢時重置翻轉狀態
                }}
                className='flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-none'
              >
                <Image
                  src={poke.sprites.front_default}
                  alt={poke.name}
                  width={40}
                  height={40}
                  unoptimized
                />
                <span className='capitalize text-gray-600'>{poke.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3D 翻轉卡牌展示區 */}
      {selected && (
        <div
          className='group w-64 h-96 perspective-[1000px] mt-4'
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`relative w-full h-full transition-all duration-500 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}
          >
            {/* 卡牌正面 (圖片) */}
            <div className='absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border-4 border-yellow-400 flex flex-col items-center justify-center p-4 backface-hidden'>
              <div className='bg-gray-100 rounded-full p-4 mb-4'>
                <Image
                  src={selected.sprites.other['official-artwork'].front_default}
                  alt={selected.name}
                  width={180}
                  height={180}
                  unoptimized
                />
              </div>
              <h2 className='text-2xl font-black capitalize text-gray-800 tracking-wider'>
                {selected.name}
              </h2>
              <p className='text-xs text-gray-400 mt-2'>點擊翻轉查看詳細數值</p>
            </div>

            {/* 卡牌背面 (詳細資訊) */}
            <div className='absolute inset-0 w-full h-full bg-slate-800 rounded-2xl shadow-xl border-4 border-yellow-500 flex flex-col items-center justify-center p-6 text-white transform-[rotateY(180deg)] backface-hidden'>
              <h3 className='text-xl font-bold mb-6 border-b border-yellow-500 w-full text-center pb-2 capitalize'>
                {selected.name} Info
              </h3>
              <div className='space-y-4 w-full text-sm'>
                <div className='flex justify-between font-mono'>
                  <span>HEIGHT</span>{' '}
                  <span className='text-yellow-400'>
                    {selected.height / 10} m
                  </span>
                </div>
                <div className='flex justify-between font-mono'>
                  <span>WEIGHT</span>{' '}
                  <span className='text-yellow-400'>
                    {selected.weight / 10} kg
                  </span>
                </div>
                <div className='flex justify-between font-mono'>
                  <span>INDEX</span>{' '}
                  <span className='text-yellow-400'>#{selected.id}</span>
                </div>
              </div>
              <div className='mt-8 text-[10px] text-gray-400 uppercase tracking-widest text-center'>
                PokéAPI Data Card
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
