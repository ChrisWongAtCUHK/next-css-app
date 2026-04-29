'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// 定義我們需要的最小資料結構
interface PokemonOption {
  id: number
  name: string
  sprites: {
    front_default: string
  }
}

const POKEMON_LIST = ['bulbasaur', 'charmander', 'squirtle', 'pikachu']

export default function PokemonSelect() {
  const [pokemonData, setPokemonData] = useState<PokemonOption[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<PokemonOption | null>(null)

  useEffect(() => {
    // 批量抓取寶可夢數據
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
    <div className='relative w-64'>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Link href='/' style={{ color: 'blue', textDecoration: 'underline' }}>
          回到首頁
        </Link>
      </div>
      {/* 模擬 Select Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-2 border rounded bg-white'
      >
        <div className='flex items-center gap-2'>
          {selected ? (
            <>
              <Image
                src={selected.sprites.front_default}
                alt={selected.name}
                width={24}
                height={24}
                unoptimized
              />
              <span className='capitalize'>{selected.name}</span>
            </>
          ) : (
            '請選擇寶可夢'
          )}
        </div>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* 模擬 Options 列表 */}
      {isOpen && (
        <ul className='absolute z-10 w-full mt-1 border rounded bg-white shadow-lg max-h-60 overflow-auto'>
          {pokemonData.map((poke) => (
            <li
              key={poke.id}
              onClick={() => {
                setSelected(poke)
                setIsOpen(false)
              }}
              className='flex items-center gap-2 p-2 hover:bg-blue-50 cursor-pointer'
            >
              <Image
                src={poke.sprites.front_default} // 使用 front_default 作為選單圖標
                alt={poke.name}
                width={30}
                height={30}
                unoptimized
              />
              <span className='capitalize'>{poke.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
