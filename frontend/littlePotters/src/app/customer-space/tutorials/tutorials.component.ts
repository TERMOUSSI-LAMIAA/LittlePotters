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
  categories: string[] = ["All", "Handbuilding", "Wheel Throwing", "Decorating"]

  tutorials: Tutorial[] = [
    {
      id: 1,
      title: "How to Make a Stoneware Pottery Bowl, from Beginning to End",
      description:
        "Learn the fundamentals of preparing clay for pottery workshops. This tutorial covers techniques, clay consistency, and storage methods to ensure optimal results.",
      thumbnailUrl: "assets/images/handbuilding.png",
      videoUrl: "https://www.youtube.com/embed/U64bLz4EWRI?rel=0",
      duration: "8 min",
      category: "Handbuilding",
    },
    {
      id: 2,
      title: "Easy Handmade Plate Tutorial",
      description:
        "If you've ever wondered how to make a plate from clay, this plate DIY is for you.",
      thumbnailUrl: "assets/images/handbuilding2.png",
      videoUrl: "https://www.youtube.com/embed/3DDm6tG_Xzc?si=QHBJyolfdofKGYZx",
      duration: "8 min",
      category: "Handbuilding",
    },
    {
      id: 3,
      title: "5 Tips & Tricks for Centring and Throwing on the Potter's Wheel",
      description:
        "Improve your pottery skills with five essential tips and tricks for throwing better pots.",
      thumbnailUrl: "assets/images/wheel.png",
      videoUrl: "https://www.youtube.com/embed/Ec9WcarGSTo?si=3HFP3F_YADpUtxMl",
      duration: "9 min",
      category: "Wheel Throwing",
    },
    {
      id: 4,
      title: "Throwing Pottery on the Wheel",
      description:
        "Few tips on how to make pulling wall whilst throwing easier",
      thumbnailUrl: "assets/images/wheel2.png",
      videoUrl: "https://www.youtube.com/embed/EcLF4kOiTPQ?si=hrHLuO4OlYW-jqP4",
      duration: "4 min",
      category: "Wheel Throwing",
    },
    {
      id: 5,
      title: "ceramic painting 🎨 how to paint and glaze ceramics",
      description:
        "how you can paint and glaze ceramics.pottery for beginners.",
      thumbnailUrl: "assets/images/decor.png",
      videoUrl: "https://www.youtube.com/embed/Cr-ATLXK5ho?si=xs5SIE-5lkOI12kh",
      duration: "15 min",
      category: "Decorating",
    },
    {
      id: 6,
      title: "Ceramic Painting Process",
      description:
        "Master the art of decorating pottery with underglaze colors. Learn the basics of sketching, mixing, and painting vibrant designs onto your pieces using fine-tipped brushes.",
      thumbnailUrl: "assets/images/decor2.png",
      videoUrl: "https://www.youtube.com/embed/lkt6MT-Gh8c?si=prYeXteC5TT5tr4X",
      duration: "6 min",
      category: "Decorating",
    },
    
  ]

  constructor(private sanitizer: DomSanitizer) { }


  getSafeVideoUrl(url: string): SafeResourceUrl {
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
    this.isVideoPlaying = false 
  }

  viewTutorial(tutorial: Tutorial): void {
    this.selectedTutorial = tutorial
    this.isVideoPlaying = false 
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
