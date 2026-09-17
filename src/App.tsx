import { useState } from 'react';
import { RouterProvider, useRouter, useApplyOverlay } from './router/Router';
import type { ApplicationData } from './lib/application';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ApplicationForm } from './components/form/ApplicationForm';
import { Home } from './pages/Home';
import { CalculatorPage } from './pages/Calculator';
import { About } from './pages/About';

function Shell() {
  const { path } = useRouter();
  const overlay = useApplyOverlay();
  const [formInitial, setFormInitial] = useState<Partial<ApplicationData> | undefined>();

  function openForm(initial?: Partial<ApplicationData>) {
    setFormInitial(initial);
    overlay.open();
  }

  let page = <Home openForm={openForm} />;
  if (path === '/calculator') page = <CalculatorPage openForm={openForm} />;
  else if (path === '/about') page = <About openForm={openForm} />;

  return (
    <div className="min-h-screen bg-ink">
      <Navbar onApply={() => openForm()} />
      <main>{page}</main>
      <Footer onApply={() => openForm()} />
      <ApplicationForm isOpen={overlay.isOpen} onClose={overlay.close} initial={formInitial} />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  );
}
