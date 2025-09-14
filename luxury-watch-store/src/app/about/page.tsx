import { Header } from "@/components/shop/Header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Crown, 
  Award, 
  Shield, 
  Users, 
  Clock, 
  Star,
  Diamond,
  Globe,
  CheckCircle,
  Target,
  Heart,
  Sparkles,
  TrendingUp
} from "lucide-react";

// Animated counter component
const AnimatedCounter = ({ end }: { end: number }) => {
  return <span>{end.toLocaleString()}</span>;
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-luxury-card rounded-full px-6 py-3 mb-8 shadow-luxury">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Our Heritage</span>
            </div>
            
            <h1 className="font-luxury text-5xl md:text-7xl font-light mb-8 leading-tight">
              Crafting <span className="text-gold-gradient font-bold">Excellence</span>
              <br />
              Since 2024
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Founded on the pillars of authenticity, expertise, and uncompromising quality, we've established ourselves as the premier destination for the world's most exceptional timepieces.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-6xl mx-auto bg-luxury-card shadow-luxury border-luxury overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent" />
            <CardContent className="p-12 md:p-16 relative">
              <div className="text-center mb-12">
                <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-6">
                  <Diamond className="h-10 w-10 text-black" />
                </div>
                <h2 className="font-luxury text-4xl md:text-5xl font-light mb-4">
                  Our <span className="text-gold-gradient font-bold">Story</span>
                </h2>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed">
                <p className="font-elegant text-xl">
                  Born from a profound passion for horological excellence, our journey began when our founders—master watchmakers with decades of Swiss training—recognized the need for a truly discerning approach to luxury timepiece acquisition.
                </p>
                
                <p>
                  Every timepiece in our collection undergoes an exhaustive authentication process, conducted by certified horologists who understand the intricate details that separate genuine masterpieces from mere imitations. We believe that owning a luxury watch is not simply about telling time—it's about carrying a piece of history, artistry, and human achievement on your wrist.
                </p>
                
                <p>
                  Our relationships with the world's most prestigious manufacturers, from historic Swiss ateliers to innovative independent creators, allow us to offer our clients access to pieces that represent the absolute pinnacle of watchmaking achievement. Each acquisition is a testament to our commitment to excellence.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl md:text-5xl font-light mb-6">
              Our <span className="text-gold-gradient font-bold">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide every interaction and define our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Authenticity Guaranteed",
                description: "Every timepiece undergoes rigorous authentication by certified Swiss horologists, ensuring complete confidence in your investment."
              },
              {
                icon: Award,
                title: "Uncompromising Excellence",
                description: "We maintain the highest standards in curation, service, and client relationships, never compromising on quality."
              },
              {
                icon: Heart,
                title: "Personal Connection",
                description: "Our dedicated specialists provide personalized attention, understanding your unique preferences and collecting goals."
              },
              {
                icon: Clock,
                title: "Timeless Heritage",
                description: "We honor watchmaking traditions while embracing innovation, bridging centuries of craftsmanship with modern excellence."
              }
            ].map((value, index) => (
              <Card key={index} className="bg-luxury-card hover-luxury border-luxury text-center group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <value.icon className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="font-luxury text-xl font-semibold mb-4 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-luxury-dark-grey/30">
        <div className="container mx-auto px-4">
          <Card className="bg-luxury-card shadow-luxury border-luxury">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <h2 className="font-luxury text-4xl md:text-5xl font-light mb-4">
                  Excellence in <span className="text-gold-gradient font-bold">Numbers</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  Our commitment to luxury measured in achievements
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="group">
                  <div className="text-5xl md:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                    <AnimatedCounter end={15000} />+
                  </div>
                  <div className="text-muted-foreground font-medium">Distinguished Clients</div>
                </div>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                    <AnimatedCounter end={850} />+
                  </div>
                  <div className="text-muted-foreground font-medium">Exceptional Timepieces</div>
                </div>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                    <AnimatedCounter end={35} />+
                  </div>
                  <div className="text-muted-foreground font-medium">Prestigious Manufacturers</div>
                </div>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                    <AnimatedCounter end={99} />.8%
                  </div>
                  <div className="text-muted-foreground font-medium">Client Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Expert Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl md:text-5xl font-light mb-6">
              Our <span className="text-gold-gradient font-bold">Masters</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the horological experts who curate and authenticate every piece in our collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marcus Zimmermann",
                title: "Master Horologist",
                description: "Trained at the prestigious Fondation de la Haute Horlogerie in Geneva, Marcus brings 25 years of Swiss watchmaking expertise to our authentication process.",
                specialization: "Swiss Complications"
              },
              {
                name: "Isabella Chen",
                title: "Collection Curator",
                description: "With an advanced degree in Art History and specialization in decorative arts, Isabella ensures each piece meets our exacting aesthetic and historical standards.",
                specialization: "Vintage & Heritage"
              },
              {
                name: "Alessandro Rossi",
                title: "Client Experience Director",
                description: "Former luxury goods executive with Cartier and Vacheron Constantin, Alessandro orchestrates our white-glove client service experience.",
                specialization: "Luxury Service"
              }
            ].map((member, index) => (
              <Card key={index} className="bg-luxury-card hover-luxury border-luxury group">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-luxury text-2xl font-semibold mb-2 text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-2">
                    {member.title}
                  </p>
                  <div className="text-primary/70 text-sm font-medium mb-4 bg-primary/10 rounded-full px-3 py-1 inline-block">
                    {member.specialization}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Partnerships */}
      <section className="py-20 bg-luxury-dark-grey/30">
        <div className="container mx-auto px-4">
          <Card className="bg-luxury-card shadow-luxury border-luxury">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <div className="flex justify-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-black" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                    <Award className="h-6 w-6 text-black" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                    <Shield className="h-6 w-6 text-black" />
                  </div>
                </div>
                <h2 className="font-luxury text-4xl md:text-5xl font-light mb-4">
                  Authorized & <span className="text-gold-gradient font-bold">Certified</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-4xl mx-auto mb-12">
                  As an authorized dealer for the world's most prestigious watch manufacturers, we guarantee authenticity, warranty coverage, and after-sales service for every timepiece in our collection.
                </p>
              </div>
              
              {/* Brand Logos Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                {[
                  'Patek Philippe', 
                  'Rolex', 
                  'Audemars Piguet', 
                  'Vacheron Constantin', 
                  'A. Lange & Söhne', 
                  'Jaeger-LeCoultre'
                ].map((brand) => (
                  <div key={brand} className="text-center group">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors duration-300">
                      <Crown className="h-8 w-8 text-primary" />
                    </div>
                    <div className="font-luxury text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {brand}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm">Serving collectors worldwide since 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}