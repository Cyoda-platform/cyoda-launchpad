import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

const Blog = () => {
  const featuredPost = {
    title: "Building Enterprise Applications with AI: A Developer's Guide",
    excerpt: "Learn how to leverage AI-powered development tools to create scalable, enterprise-grade applications in a fraction of the time.",
    author: "Cyoda Team",
    date: "January 15, 2025",
    readTime: "8 min read",
    image: "/api/placeholder/800/400",
    slug: "building-enterprise-ai-applications"
  };

  const blogPosts = [
    {
      title: "From Prototype to Production: Lessons Learned",
      excerpt: "Key insights from developers who successfully scaled their applications using modern development platforms.",
      author: "Sarah Chen",
      date: "January 12, 2025",
      readTime: "6 min read",
      category: "Development",
      slug: "prototype-to-production-lessons"
    },
    {
      title: "The Future of Low-Code Development",
      excerpt: "Exploring how AI-powered low-code platforms are transforming the way we build software.",
      author: "Michael Rodriguez",
      date: "January 8, 2025",
      readTime: "5 min read",
      category: "Industry",
      slug: "future-of-low-code"
    },
    {
      title: "Microservices Architecture Best Practices",
      excerpt: "Essential patterns and practices for building scalable microservices with modern cloud platforms.",
      author: "Alex Kim",
      date: "January 5, 2025",
      readTime: "10 min read",
      category: "Architecture",
      slug: "microservices-best-practices"
    },
    {
      title: "Security First: Building Secure Applications",
      excerpt: "A comprehensive guide to implementing security best practices in modern web applications.",
      author: "Lisa Thompson",
      date: "January 2, 2025",
      readTime: "7 min read",
      category: "Security",
      slug: "security-first-applications"
    },
    {
      title: "API Design Patterns for Modern Applications",
      excerpt: "Learn how to design robust, scalable APIs that can grow with your application needs.",
      author: "David Park",
      date: "December 28, 2024",
      readTime: "9 min read",
      category: "API Design",
      slug: "api-design-patterns"
    },
    {
      title: "Database Optimization for High-Performance Apps",
      excerpt: "Strategies and techniques for optimizing database performance in high-traffic applications.",
      author: "Emma Wilson",
      date: "December 25, 2024",
      readTime: "8 min read",
      category: "Database",
      slug: "database-optimization"
    }
  ];

  const categories = ["All", "Development", "Industry", "Architecture", "Security", "API Design", "Database"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-dark relative">
          <div className="absolute inset-0 texture-overlay opacity-30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gradient-hero mb-6">
                Developer Insights & Updates
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Stay up to date with the latest in application development, AI-powered tools, and industry best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-card/30 backdrop-blur border border-border/50 rounded-2xl overflow-hidden glow-hover">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="p-8">
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                        Featured
                      </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                      {featuredPost.title}
                    </h2>
                    
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-6">
                      <User className="w-4 h-4 mr-2" />
                      <span className="mr-4">{featuredPost.author}</span>
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="mr-4">{featuredPost.date}</span>
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    
                    <Button className="bg-gradient-primary text-white glow-primary">
                      Read Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  
                  <div className="bg-gradient-primary/10 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-primary/20 flex items-center justify-center mb-4">
                        <div className="text-4xl">📝</div>
                      </div>
                      <p className="text-muted-foreground">Featured Article</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className="bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 bg-gradient-dark relative">
          <div className="absolute inset-0 texture-overlay opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <article 
                    key={index}
                    className="group bg-card/20 backdrop-blur border border-border/50 rounded-xl overflow-hidden hover:bg-card/40 transition-all duration-300 glow-hover"
                  >
                    <div className="p-6">
                      <div className="mb-4">
                        <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center text-xs text-muted-foreground mb-4">
                        <User className="w-3 h-3 mr-1" />
                        <span className="mr-3">{post.author}</span>
                        <Calendar className="w-3 h-3 mr-1" />
                        <span className="mr-3">{post.date}</span>
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10 p-0"
                      >
                        Read More <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent mb-6">
                Stay Updated
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get the latest articles and updates delivered straight to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-12 px-4 rounded-lg border border-border/50 bg-background/50 backdrop-blur focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Button className="bg-gradient-primary text-white glow-primary">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;