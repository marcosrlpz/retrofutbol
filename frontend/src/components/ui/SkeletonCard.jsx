import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const Shine = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: ${({ $r }) => $r || "var(--radius-sm)"};
`;

const Card = styled.div`
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const ImgBlock = styled(Shine)`
  aspect-ratio: 3/4;
  width: 100%;
  border-radius: 0;
`;

const Body = styled.div`
  padding: 0.65rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkeletonCard = () => (
  <Card>
    <ImgBlock />
    <Body>
      <Shine style={{ height: "10px", width: "50%" }} />
      <Shine style={{ height: "13px", width: "85%" }} />
      <Shine style={{ height: "10px", width: "40%" }} />
      <Shine style={{ height: "16px", width: "35%", marginTop: "0.3rem" }} />
    </Body>
  </Card>
);

export const SkeletonGrid = ({ count = 8, columns = 4 }) => {
  const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: var(--spacing-md);
    @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm); }
  `;
  return (
    <Grid>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </Grid>
  );
};

export default SkeletonCard;