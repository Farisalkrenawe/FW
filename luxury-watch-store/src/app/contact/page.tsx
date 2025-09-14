import { Header } from "@/components/shop/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Crown,
  Send,
  MessageSquare,
  Shield,
  Award,
  Users,
  Globe,
  Calendar,
  Star
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-luxury-card rounded-full px-6 py-3 mb-8 shadow-luxury">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Expert Consultation</span>
            </div>
            
            <h1 className="font-luxury text-5xl md:text-6xl font-light mb-6">
              Connect with <span className="text-gold-gradient font-bold">Experts</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our master horologists and luxury watch specialists are here to guide you through our exceptional collection. Experience personalized service that matches the caliber of our timepieces.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <Card className="bg-luxury-card shadow-luxury border-luxury">
              <CardHeader className="pb-6">
                <CardTitle className="font-luxury text-3xl font-light text-foreground flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-primary" />
                  Private Consultation
                </CardTitle>
                <p className="text-muted-foreground">
                  Schedule a personalized consultation with our experts
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      First Name *
                    </label>
                    <Input 
                      placeholder="Enter first name" 
                      className="bg-luxury-dark-grey border-luxury-medium-grey text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Last Name *
                    </label>
                    <Input 
                      placeholder="Enter last name" 
                      className="bg-luxury-dark-grey border-luxury-medium-grey text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Email Address *
                  </label>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="bg-luxury-dark-grey border-luxury-medium-grey text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Phone Number
                  </label>
                  <Input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    className="bg-luxury-dark-grey border-luxury-medium-grey text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Area of Interest
                  </label>
                  <Input 
                    placeholder="Swiss luxury watches, vintage collections..." 
                    className="bg-luxury-dark-grey border-luxury-medium-grey text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Message *
                  </label>
                  <Textarea 
                    placeholder="Tell us about your horological interests, preferred brands, investment goals, or any specific timepieces you're seeking..."
                    className="bg-luxury-dark-grey border-luxury-medium-grey text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 min-h-[140px]"
                  />
                </div>
                
                <Button className="btn-luxury w-full text-lg py-4">
                  <Send className="w-5 h-5 mr-2" />
                  Request Consultation
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  * Required fields. We typically respond within 2-4 hours during business hours.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Showroom Info */}
              <Card className="bg-luxury-card shadow-luxury border-luxury">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                      <Crown className="h-6 w-6 text-black" />
                    </div>
                    <h2 className="font-luxury text-2xl font-semibold text-foreground">Private Showroom</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Exclusive Location</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Madison Avenue Atelier<br />
                          Fifth Avenue, Suite 2701<br />
                          New York, NY 10022<br />
                          <span className="text-primary text-sm">By appointment only</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Direct Line</h3>
                        <p className="text-muted-foreground">+1 (212) 555-LUXURY</p>
                        <p className="text-primary text-sm">24/7 concierge service</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Private Email</h3>
                        <p className="text-muted-foreground">concierge@luxurytimepieces.com</p>
                        <p className="text-primary text-sm">Secure communication</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Consultation Hours</h3>
                        <div className="text-muted-foreground space-y-1 text-sm">
                          <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                          <p>Saturday: 10:00 AM - 7:00 PM</p>
                          <p>Sunday: 12:00 PM - 6:00 PM</p>
                          <p className="text-primary mt-2">Private appointments available 24/7</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Card */}
              <Card className="bg-luxury-card shadow-luxury border-luxury">
                <CardContent className="p-8">
                  <h3 className="font-luxury text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary" />
                    Exclusive Services
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Shield,
                        title: "Authentication & Certification",
                        description: "Swiss-certified authenticity guarantee"
                      },
                      {
                        icon: Users,
                        title: "Personal Watch Curator",
                        description: "Dedicated expert for your collection"
                      },
                      {
                        icon: Globe,
                        title: "Global Acquisition",
                        description: "Worldwide sourcing of rare timepieces"
                      },
                      {
                        icon: Calendar,
                        title: "White-Glove Service",
                        description: "Private viewings and home delivery"
                      }
                    ].map((service, index) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors duration-300">
                          <service.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground mb-1">{service.title}</div>
                          <div className="text-muted-foreground text-sm">{service.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial */}
              <Card className="bg-luxury-card shadow-gold border-luxury overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent" />
                <CardContent className="p-8 relative">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-elegant text-lg italic text-foreground mb-6 leading-relaxed">
                    "The level of expertise and personal attention I received was extraordinary. They helped me acquire a 1967 Daytona that I'd been searching for decades."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                      <Crown className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Marcus Wellington</div>
                      <div className="text-muted-foreground text-sm">Private Collector, London</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}