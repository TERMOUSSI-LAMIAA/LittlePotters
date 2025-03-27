import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Tutorial {
  id: number
  title: string
  description: string
  thumbnailUrl: string
  videoUrl?: string
  imageUrls?: string[]
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
}

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.scss'
})
export class TutorialsComponent {
  selectedCategory = "All"
  selectedTutorial: Tutorial | null = null
  isVideoPlaying = false;
  categories: string[] = ["All", "Clay Preparation", "Wheel Throwing", "Hand Building", "Glazing", "Firing"]

  tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Clay Preparation Basics",
      description:
        "Learn the fundamentals of preparing clay for pottery workshops. This tutorial covers wedging techniques, clay consistency, and storage methods to ensure optimal results.",
      thumbnailUrl: "assets/images/485403873_1187842876679777_4036242185063634361_n.jpg",
      videoUrl: "https://www.youtube.com/embed/U64bLz4EWRI",
      duration: "12 min",
      level: "Beginner",
      category: "Clay Preparation",
    },
    {
      id: 2,
      title: "Introduction to Wheel Throwing",
      description:
        "Master the basics of wheel throwing with this comprehensive tutorial. Learn how to center clay, open the form, and pull walls to create beautiful cylindrical vessels.",
      thumbnailUrl: "/placeholder.svg?height=200&width=350",
      videoUrl: "https://example.com/videos/wheel-throwing-intro.mp4",
      duration: "18 min",
      level: "Beginner",
      category: "Wheel Throwing",
    },
    {
      id: 3,
      title: "Advanced Glazing Techniques",
      description:
        "Explore advanced glazing methods to create stunning finishes on your pottery. This tutorial covers layering, wax resist, and specialty application techniques.",
      thumbnailUrl: "/placeholder.svg?height=200&width=350",
      imageUrls: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      duration: "25 min",
      level: "Advanced",
      category: "Glazing",
    },
    {
      id: 4,
      title: "Coil Building for Beginners",
      description:
        "Learn the ancient technique of coil building to create pottery without a wheel. This tutorial shows how to roll even coils, join them securely, and build various forms.",
      thumbnailUrl: "/placeholder.svg?height=200&width=350",
      videoUrl: "https://example.com/videos/coil-building.mp4",
      duration: "15 min",
      level: "Beginner",
      category: "Hand Building",
    },
    {
      id: 5,
      title: "Kiln Loading and Firing Safety",
      description:
        "Essential knowledge for safe and efficient kiln operation. Learn proper loading techniques, temperature management, and safety protocols for electric and gas kilns.",
      thumbnailUrl: "/placeholder.svg?height=200&width=350",
      videoUrl: "https://example.com/videos/kiln-safety.mp4",
      duration: "22 min",
      level: "Intermediate",
      category: "Firing",
    },
    {
      id: 6,
      title: "Decorative Slab Techniques",
      description:
        "Explore creative ways to texture and form clay slabs into functional and decorative pieces. Learn to use texture tools, templates, and joining methods.",
      thumbnailUrl: "/placeholder.svg?height=200&width=350",
      imageUrls: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      duration: "20 min",
      level: "Intermediate",
      category: "Hand Building",
    },
  ]

  constructor(private sanitizer: DomSanitizer) { }


  getSafeVideoUrl(url: string): SafeResourceUrl {
    // Add autoplay when video is playing
    const videoUrl = this.isVideoPlaying ? `${url}?autoplay=1` : url
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl)
  }

  get filteredTutorials(): Tutorial[] {
    if (this.selectedCategory === "All") {
      return this.tutorials
    }
    return this.tutorials.filter((tutorial) => tutorial.category === this.selectedCategory)
  }

  selectCategory(category: string): void {
    this.selectedCategory = category
    this.selectedTutorial = null
    this.isVideoPlaying = false // Reset video state when changing category
  }

  viewTutorial(tutorial: Tutorial): void {
    this.selectedTutorial = tutorial
    this.isVideoPlaying = false // Start with placeholder visible
  }

  playVideo(): void {
    this.isVideoPlaying = true
  }

  backToList(): void {
    this.selectedTutorial = null
    this.isVideoPlaying = false
  }

  closeVideo(): void {
    this.isVideoPlaying = false
  }
}
