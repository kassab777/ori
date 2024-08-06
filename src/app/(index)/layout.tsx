// import { MainLayout } from 'src/layouts/main';
import { SimpleLayout } from 'src/layouts/simple';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  // return <MainLayout>{children}</MainLayout>;
  return <SimpleLayout content={{ compact: true }}>{children}</SimpleLayout>;
}
