import { motion, AnimatePresence } from "framer-motion";
import { Flame, Building2, PartyPopper, Users, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const activities = [
  { icon: Flame, text: "32 users applied recently", color: "text-warning", bg: "bg-warning/10" },
  { icon: Building2, text: "Infosys posted 3 new jobs", color: "text-primary", bg: "bg-primary/10" },
  { icon: PartyPopper, text: "You got shortlisted for Data Analyst!", color: "text-success", bg: "bg-success/10" },
  { icon: Users, text: "15 new companies joined this week", color: "text-secondary", bg: "bg-secondary/10" },
  { icon: TrendingUp, text: "Data Analyst roles trending up 40%", color: "text-primary", bg: "bg-primary/10" },
  { icon: Zap, text: "Your profile was viewed by Wipro", color: "text-accent", bg: "bg-accent/10" },
];

export default function LiveActivityFeed() {
  const [visibleItems, setVisibleItems] = useState(activities.slice(0, 4));
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleItems((prev) => {
        const nextIndex = (activities.indexOf(prev[0]) + 1) % activities.length;
        const items = [];
        for (let i = 0; i < 4; i++) {
          items.push(activities[(nextIndex + i) % activities.length]);
        }
        return items;
      });
      setKey((k) => k + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clean-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <h3 className="text-sm font-heading font-semibold">Live Activity</h3>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, i) => (
            <motion.div
              key={`${key}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className={`p-1.5 rounded-lg ${item.bg} flex-shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
