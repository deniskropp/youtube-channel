"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Menu, X, Bell, User, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center mr-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <span>AI Channel</span>
                </Link>
                <Link href="/" className="text-sm">
                  Home
                </Link>
                <Link href="/playlists" className="text-sm">
                  Playlists
                </Link>
                <Link href="/about" className="text-sm">
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Youtube className="h-5 w-5 text-red-600" />
            <span className="hidden md:inline-block">AI Channel</span>
          </Link>
        </div>

        <div className={`flex-1 ${isSearchOpen ? "flex" : "hidden md:flex"} items-center justify-center px-4`}>
          <form className="w-full max-w-lg flex items-center gap-2" onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Search"
              className="h-9 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="sm" variant="ghost" className="h-9 w-9 px-0">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            <span className="sr-only">Toggle search</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

