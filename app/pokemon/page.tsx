'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PokemonOption {
  id: number
  name: string
  height: number
  weight: number
  types: { type: { name: string } }[] // 屬性欄位
  sprites: {
    front_default: string
    other: {
      'official-artwork': { front_default: string }
    }
  }
}

// 屬性顏色映射表 (Tailwind Class)
const TYPE_COLORS: Record<string, string> = {
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  psychic: 'bg-pink-500',
  ice: 'bg-cyan-300',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  fairy: 'bg-rose-300',
  normal: 'bg-slate-400',
  fighting: 'bg-red-700',
  flying: 'bg-sky-400',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  rock: 'bg-stone-500',
  bug: 'bg-lime-500',
  ghost: 'bg-violet-700',
  steel: 'bg-zinc-400',
}

// 定義顏色碼 (Hex Codes)
const TYPE_HEX_COLORS: Record<string, string> = {
  normal: '#9ca3af', // gray-400
  fire: '#f97316', // orange-500
  water: '#3b82f6', // blue-500
  grass: '#22c55e', // green-500
  electric: '#eab308', // yellow-400
  ice: '#67e8f9', // cyan-300
  fighting: '#ef4444', // red-500
  poison: '#a855f7', // purple-500
  ground: '#d97706', // amber-600
  flying: '#38bdf8', // sky-400
  psychic: '#ec4899', // pink-500
  bug: '#84cc16', // lime-500
  rock: '#78716c', // stone-500
  ghost: '#6d28d9', // violet-700
  dragon: '#4f46e5', // indigo-600
  steel: '#71717a', // zinc-500
  fairy: '#f472b6', // rose-400
  dark: '#1f2937', // gray-800
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
          className='group w-64 h-96 perspective-[1000px] mt-4 hover:scale-105 transition-transform duration-300'
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`relative w-full h-full transition-all duration-500 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}
          >
            {/* 卡牌正面 (圖片) - 保持白色或加上淡淡的邊框色 */}
            <div
              className='absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border-4 flex flex-col items-center justify-center p-4 backface-hidden'
              style={{
                borderColor: selected.types[0]
                  ? TYPE_HEX_COLORS[selected.types[0].type.name]
                  : '#facc15',
              }}
            >
              <div className='bg-gray-100 rounded-full p-4 mb-4'>
                {/* 在 Image 標籤加入淡入效果 */}
                <Image
                  src={selected.sprites.other['official-artwork'].front_default}
                  alt={selected.name}
                  width={180}
                  height={180}
                  className='transition-opacity duration-300'
                  onLoadingComplete={(img) => img.classList.remove('opacity-0')}
                  unoptimized
                />
              </div>
              <h2 className='text-2xl font-black capitalize text-gray-800 tracking-wider'>
                {selected.name}
              </h2>
              <p className='text-xs text-gray-400 mt-2'>點擊翻轉查看詳細數值</p>
            </div>

            {/* 卡牌背面 (詳細資訊) */}
            <div
              className={`absolute inset-0 w-full h-full rounded-2xl shadow-xl border-4 border-white/50 flex flex-col items-center justify-center p-6 text-white transform-[rotateY(180deg)] backface-hidden ${TYPE_COLORS[selected.types[0].type.name] || 'bg-slate-800'}`}
            >
              <h3 className='text-xl font-bold mb-2 border-b border-white/30 w-full text-center pb-2 capitalize'>
                {selected.name} Info
              </h3>
              {/* 顯示屬性標籤 */}
              <div className='flex gap-2 mb-4'>
                {selected.types.map((t) => (
                  <span
                    key={t.type.name}
                    className='px-2 py-1 bg-white/20 rounded-full text-xs uppercase tracking-tighter'
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
              <div className='space-y-3 w-full text-sm'>
                <div className='flex justify-between font-mono'>
                  <span>HEIGHT</span> <span>{selected.height / 10} m</span>
                </div>
                <div className='flex justify-between font-mono'>
                  <span>WEIGHT</span> <span>{selected.weight / 10} kg</span>
                </div>
                <div className='flex justify-between font-mono'>
                  <span>INDEX</span> <span>#{selected.id}</span>
                </div>
              </div>
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
