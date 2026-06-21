# Implementation Guide for Responsive Design & Loaders

## Quick Start Examples

### 1. Using the Loader Component

```tsx
import { Loader, SkeletonLoader, ButtonLoader, PageLoader } from "@/components/ui/loader";

// Simple spinner with message
<Loader size="md" variant="default" message="Loading..." />

// Pulse animation
<Loader size="lg" variant="pulse" message="Fetching data..." />

// Bounce animation
<Loader size="sm" variant="bounce" />

// Full screen loader
<Loader fullScreen size="lg" message="Processing..." />

// Skeleton loader for cards
<SkeletonLoader count={3} variant="card" />

// Skeleton for list items
<SkeletonLoader count={5} variant="text" />

// Skeleton for avatar + info
<SkeletonLoader variant="avatar" />

// Button with loading state
<ButtonLoader isLoading={isLoading} className="bg-blue-500">
  Submit Form
</ButtonLoader>

// Full page loading
<PageLoader message="Loading dashboard..." />
```

---

### 2. Making Forms Responsive

**Before (Not Responsive):**
```tsx
<div style={{ display: "flex", gap: "12px" }}>
  <input style={{ width: "200px", padding: "12px" }} />
  <button style={{ padding: "12px 24px" }}>Submit</button>
</div>
```

**After (Responsive):**
```tsx
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <input className="flex-1 px-4 py-2.5 text-sm sm:text-base" />
  <button className="px-4 sm:px-6 py-2.5 text-sm sm:text-base whitespace-nowrap">
    Submit
  </button>
</div>
```

**Key Responsive Classes:**
- `flex-col sm:flex-row` - Stack on mobile, row on desktop
- `gap-3 sm:gap-4` - Smaller gap on mobile
- `px-4 sm:px-6` - Smaller padding on mobile
- `text-sm sm:text-base` - Smaller text on mobile
- `whitespace-nowrap` - Prevent button text wrapping

---

### 3. Making Tables Responsive

**Before (Not Responsive):**
```tsx
<table style={{ width: "100%" }}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {/* rows */}
  </tbody>
</table>
```

**After (Responsive):**
```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-gray-200">
        <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold">
          Name
        </th>
        <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold">
          Email
        </th>
        <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold">
          Status
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">John Doe</td>
        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">john@example.com</td>
        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">Active</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Key Features:**
- `overflow-x-auto` - Horizontal scroll on mobile
- Responsive padding and text sizes
- Properly spaced columns

---

### 4. Form with Loading State

```tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function MyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        // Success handling
        console.log("Success!");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 sm:p-4 text-red-200 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Input Field */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 transition text-sm sm:text-base"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-md font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
```

---

### 5. Responsive Grid Layout

**Before:**
```tsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

**After:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

**Responsive Patterns:**
- `grid-cols-1` - 1 column on mobile
- `sm:grid-cols-2` - 2 columns on small screens
- `lg:grid-cols-3` - 3 columns on large screens
- `xl:grid-cols-4` - 4 columns on extra large screens
- `gap-4 sm:gap-6` - Smaller gap on mobile

---

### 6. Responsive Typography

**Before:**
```tsx
<h1 style={{ fontSize: "48px" }}>Title</h1>
<p style={{ fontSize: "16px" }}>Subtitle</p>
```

**After:**
```tsx
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
  Title
</h1>
<p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2">
  Subtitle
</p>
```

**Text Size Scale:**
- `text-xs` - Extra small (12px)
- `text-sm` - Small (14px)
- `text-base` - Base (16px)
- `text-lg` - Large (18px)
- `text-xl` - Extra large (20px)
- `text-2xl` - 2XL (24px)
- `text-3xl` - 3XL (30px)
- `text-4xl` - 4XL (36px)

---

### 7. Mobile-First Navigation Pattern

```tsx
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-xl font-bold">Logo</div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-sm hover:text-blue-600">Home</a>
          <a href="/about" className="text-sm hover:text-blue-600">About</a>
          <a href="/contact" className="text-sm hover:text-blue-600">Contact</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-3">
            <a href="/" className="text-sm py-2 hover:text-blue-600">Home</a>
            <a href="/about" className="text-sm py-2 hover:text-blue-600">About</a>
            <a href="/contact" className="text-sm py-2 hover:text-blue-600">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
}
```

---

### 8. Email Authentication Pattern

```tsx
"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to send email");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <p className="text-green-600 font-semibold">
          Check your email for a reset link
        </p>
        <p className="text-gray-600">
          We sent a password reset link to <strong>{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 transition"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-md font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>
    </form>
  );
}
```

---

## Tailwind Responsive Breakpoints Reference

| Breakpoint | CSS | Pixels |
|-----------|-----|--------|
| Default | - | < 640px |
| sm | @media (min-width: 640px) | ≥ 640px |
| md | @media (min-width: 768px) | ≥ 768px |
| lg | @media (min-width: 1024px) | ≥ 1024px |
| xl | @media (min-width: 1280px) | ≥ 1280px |
| 2xl | @media (min-width: 1536px) | ≥ 1536px |

**Usage:**
```tsx
// Mobile first - base styles apply to all sizes
<div className="text-sm p-4 
  // Apply to 640px+
  sm:text-base sm:p-6
  // Apply to 768px+
  md:text-lg md:p-8
  // Apply to 1024px+
  lg:text-xl lg:p-10
">
  Responsive content
</div>
```

---

## Common Responsive Patterns Checklist

- ✅ Stack layouts vertically on mobile
- ✅ Grid columns: 1 → 2 → 3 → 4
- ✅ Responsive padding: smaller on mobile
- ✅ Responsive text sizes
- ✅ Hidden elements on mobile
- ✅ Visible elements only on certain screens
- ✅ Touch-friendly button sizes (44px minimum)
- ✅ Horizontal scroll for tables
- ✅ Mobile menu with hamburger icon
- ✅ Proper contrast ratios
- ✅ Loading states for all interactions
- ✅ Error handling with feedback

---

## Testing Your Responsive Design

1. **DevTools Device Emulation**
   - Press F12 → Device Toolbar (Ctrl+Shift+M)
   - Test different device presets

2. **Manual Testing**
   - Resize browser window from full width to narrow
   - Check if elements stack/reflow properly
   - Verify touch targets are large enough

3. **Real Device Testing**
   - Test on actual phone/tablet
   - Check performance on slower networks
   - Verify loading states work smoothly

---

## Performance Tips

- Use `lazy` loading for images
- Implement infinite scroll responsibly
- Minimize CSS for mobile
- Use `will-change` sparingly
- Test on 3G networks
- Monitor Core Web Vitals

---

**Remember:** Always test on real devices, not just DevTools emulation!
