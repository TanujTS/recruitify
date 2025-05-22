import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from "@/components/ui/button"

const ProcessStepsCarousel = (props) => {
  const { options } = props
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  })

  // Process steps data
  const processSteps = [
    {
      id: 1,
      icon: "📝",
      title: "Post Role + Requirements",
      description: "Define your job requirements and post your role to attract the right candidates.",
    },
    {
      id: 2,
      icon: "📄",
      title: "Upload Resume",
      description: "Candidates upload their resumes and professional profiles for review.",
    },
    {
      id: 3,
      icon: "🔗",
      title: "Get Smart Rating And Analysis",
      description: "Our AI analyzes candidate fit and provides smart ratings for better matching.",
    },
    {
      id: 4,
      icon: "👥",
      title: "Interview the Best Fit",
      description: "Connect with top-rated candidates and conduct interviews with the best matches.",
    }
  ]

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="process-carousel mt-12">
      <div className="process-carousel__viewport" ref={emblaMainRef}>
        <div className="process-carousel__container">
          {processSteps.map((step, index) => (
            <div className="process-carousel__slide" key={step.id}>
              <div className="process-step-card">
                <div className="step-icon">
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="process-thumbs">
        <div className="process-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="process-thumbs__container">
            {processSteps.map((step, index) => (
              <div
                key={step.id}
                className={`process-thumbs__slide ${
                  index === selectedIndex ? 'process-thumbs__slide--selected' : ''
                }`}
              >
                <button
                  onClick={() => onThumbClick(index)}
                  type="button"
                  className="process-thumbs__button"
                >
                  <span className="thumb-icon">{step.icon}</span>
                  <span className="thumb-text">{step.title}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessStepsCarousel