import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BlogPost } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Search, Clock, Calendar, User, ChevronRight, X, Sparkles, BookOpen } from 'lucide-react';

export const BlogsPage: React.FC = () => {
  const { blogs } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const categories = ['All', 'Domestic Travel', 'Heritage & Culture', 'International Travel'];

  const filteredBlogs = blogs.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchSearch = b.title.toLowerCase().includes(term) || b.excerpt.toLowerCase().includes(term);
    const matchCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const featuredBlog = blogs.find(b => b.featured) || blogs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#00AEEF]">
            Travel Insights
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            SkyNet Travel Magazine & Guides
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Expert itineraries, luxury travel tips, and destination inspiration.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search blogs (e.g. Kashmir, Japan, Rajasthan)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#00AEEF] shadow-sm"
          />
        </div>
      </div>

      {/* Featured Blog Hero Card */}
      {featuredBlog && !searchTerm && selectedCategory === 'All' && (
        <div
          onClick={() => setSelectedBlog(featuredBlog)}
          className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-white grid grid-cols-1 lg:grid-cols-2 border border-slate-800 group cursor-pointer"
        >
          <div className="relative h-64 lg:h-auto overflow-hidden">
            <ImageWithFallback
              src={featuredBlog.image}
              alt={featuredBlog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              fallbackTitle={featuredBlog.title}
              category={featuredBlog.category}
            />
            <span className="absolute top-4 left-4 bg-[#FDB813] text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              Featured Story
            </span>
          </div>

          <div className="p-6 md:p-10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#00AEEF] uppercase tracking-wider block">
                {featuredBlog.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold group-hover:text-[#00AEEF] transition-colors">
                {featuredBlog.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {featuredBlog.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#00AEEF]" />
                <span>{featuredBlog.author}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#00AEEF] group-hover:underline">
                <span>Read Full Article</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-slate-400 mr-2">Categories:</span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#00AEEF] text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map(blog => (
          <div
            key={blog.id}
            onClick={() => setSelectedBlog(blog)}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <ImageWithFallback
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                fallbackTitle={blog.title}
                category={blog.category}
              />
              <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {blog.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 line-clamp-2 group-hover:text-[#00AEEF] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3">{blog.excerpt}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#00AEEF] font-bold group-hover:underline">
                <span>Read Story</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-slate-100 shadow-2xl relative">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 md:h-80 overflow-hidden bg-slate-900">
              <ImageWithFallback
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
                fallbackTitle={selectedBlog.title}
                category={selectedBlog.category}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-[#00AEEF] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {selectedBlog.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold">{selectedBlog.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <span>By {selectedBlog.author} ({selectedBlog.authorRole || 'Specialist'})</span>
                  <span>•</span>
                  <span>{selectedBlog.date}</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {selectedBlog.content}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBlog(null)}
                className="bg-slate-900 hover:bg-[#00AEEF] text-white font-bold px-6 py-2.5 rounded-full text-xs transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
