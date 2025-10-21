import { Label } from "@/components/ui/label"
import { Banknote, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Props = {
  handleSearch: (term: string) => void;
  handleLocation: (location: string) => void;
  handleMinSalary: (minSalary: number) => void;
  handleMaxSalary: (maxSalary: number) => void;
}

const Filters = (props: Props) => {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 mb-8 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold">Filter Opportunities</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Input */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="searchTerm" className="text-sm font-semibold text-foreground">
            Search Jobs
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              type="text"
              onChange={(e) => props.handleSearch(e.target.value)}
              id="searchTerm"
              placeholder="e.g. Machine Learning Engineer"
              className="pl-11 h-12 bg-background border-border/50 focus:border-primary transition-colors text-base"
            />
          </div>
        </div>

        {/* Location Input */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-semibold text-foreground">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              type="text"
              onChange={(e) => props.handleLocation(e.target.value)}
              id="location"
              placeholder="e.g. Manchester"
              className="pl-11 h-12 bg-background border-border/50 focus:border-primary transition-colors text-base"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minSalary" className="text-sm font-semibold text-foreground">
              Min Salary
            </Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                type="number"
                onChange={(e) => props.handleMinSalary(Number.parseInt(e.target.value) || 0)}
                id="minSalary"
                placeholder="30000"
                className="pl-11 h-12 bg-background border-border/50 focus:border-primary transition-colors text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxSalary" className="text-sm font-semibold text-foreground">
              Max Salary
            </Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                type="number"
                onChange={(e) => props.handleMaxSalary(Number.parseInt(e.target.value) || 0)}
                id="maxSalary"
                placeholder="100000"
                className="pl-11 h-12 bg-background border-border/50 focus:border-primary transition-colors text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </div>  )
}

export default Filters
