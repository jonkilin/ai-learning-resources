import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from '../components/Loading';

const Home = lazy(() => import('../views/Home'));
const Resources = lazy(() => import('../views/Resources'));
const Roadmap = lazy(() => import('../views/Roadmap'));
const About = lazy(() => import('../views/About'));

const Router = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
