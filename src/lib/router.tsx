import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface RouterContextType {
  path: string;
  params: Record<string, string>;
  navigate: (to: string, replace?: boolean) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: "/",
  params: {},
  navigate: () => {},
});

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

export function useParams<T extends Record<string, string>>(): T {
  return useContext(RouterContext).params as T;
}

export function usePath() {
  return useContext(RouterContext).path;
}

function matchRoute(
  pattern: string,
  path: string
): Record<string, string> | null {
  if (pattern === "*") return {};

  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export function Router({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    if (replace) {
      window.history.replaceState(null, "", to);
    } else {
      window.history.pushState(null, "", to);
    }
    setPath(to);
  }, []);

  return (
    <RouterContext.Provider value={{ path, params, navigate }}>
      <RouteMatchProvider path={path} setParams={setParams}>
        {children}
      </RouteMatchProvider>
    </RouterContext.Provider>
  );
}

const RouteMatchContext = createContext<{
  path: string;
  setParams: (p: Record<string, string>) => void;
}>({ path: "/", setParams: () => {} });

function RouteMatchProvider({
  path,
  setParams,
  children,
}: {
  path: string;
  setParams: (p: Record<string, string>) => void;
  children: React.ReactNode;
}) {
  return (
    <RouteMatchContext.Provider value={{ path, setParams }}>
      {children}
    </RouteMatchContext.Provider>
  );
}

interface RouteProps {
  path: string;
  element: React.ReactNode;
}

export function Routes({ children }: { children: React.ReactNode }) {
  const { path } = useContext(RouterContext);
  const children_arr = React.Children.toArray(children) as React.ReactElement<RouteProps>[];

  for (const child of children_arr) {
    const pattern = child.props.path;
    const matched = matchRoute(pattern, path);
    if (matched !== null) {
      return (
        <ParamsProvider params={matched}>
          {child.props.element}
        </ParamsProvider>
      );
    }
  }
  return null;
}

export function Route(_props: RouteProps) {
  return null;
}

const ParamsContext = createContext<Record<string, string>>({});

function ParamsProvider({
  params,
  children,
}: {
  params: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <ParamsContext.Provider value={params}>{children}</ParamsContext.Provider>
  );
}

// Override useParams to use ParamsContext
export function useRouteParams<T extends Record<string, string>>(): T {
  return useContext(ParamsContext) as T;
}

export function Link({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
