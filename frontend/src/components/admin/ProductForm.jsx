import { useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import toast from "react-hot-toast";
import { createProductService, updateProductService } from "../../services/product.service";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
`;

const Modal = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--color-primary);
`;

const ModalTitle = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 1rem;
  transition: var(--transition);
  &:hover { background: var(--color-bg-secondary); color: var(--color-text); }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const Label = styled.label`
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Input = styled.input`
  background: var(--color-bg-secondary);
  border: 1px solid ${({ $error }) => $error ? "var(--color-danger)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.65rem 0.9rem;
  color: var(--color-text);
  font-size: 0.9rem;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;

const Select = styled.select`
  background: var(--color-bg-secondary);
  border: 1px solid ${({ $error }) => $error ? "var(--color-danger)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.65rem 0.9rem;
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-family);
  cursor: pointer;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;

const Textarea = styled.textarea`
  background: var(--color-bg-secondary);
  border: 1px solid ${({ $error }) => $error ? "var(--color-danger)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  padding: 0.65rem 0.9rem;
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-family);
  resize: vertical;
  min-height: 80px;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--color-primary); background: white; }
`;

const ErrorMsg = styled.span`
  font-size: 0.72rem;
  color: var(--color-danger);
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  margin-top: var(--spacing-xs);
`;

const BtnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
`;

const CancelBtn = styled.button`
  padding: 0.75rem;
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  transition: var(--transition);
  &:hover { border-color: var(--color-primary); }
`;

const SaveBtn = styled.button`
  padding: 0.75rem;
  background: #111827;
  color: white;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  transition: var(--transition);
  &:hover:not(:disabled) { background: var(--color-accent); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const leagues = ["La Liga", "Premier League", "Serie A", "Bundesliga", "Otros Países", "Selecciones"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductForm = ({ product, onClose }) => {
  const isEditing = !!product;
  const fileRef = useRef();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      temporada: product.temporada,
      talla: product.talla,
      color: product.color,
      gender: product.gender,
      stock: product.stock,
      rating: product.rating,
      image_url: product.image_url,
    } : { gender: "Hombre", rating: 4.5 },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") formData.append(key, value);
      });
      if (fileRef.current?.files?.[0]) {
        formData.append("image", fileRef.current.files[0]);
      }
      if (isEditing) {
        await updateProductService(product._id, formData);
        toast.success("Camiseta actualizada ✅");
      } else {
        await createProductService(formData);
        toast.success("Camiseta creada ✅");
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al guardar");
    }
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <ModalHeader>
          <ModalTitle>{isEditing ? "✏️ Editar camiseta" : "➕ Nueva camiseta"}</ModalTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Field>
              <Label>Liga / Categoría *</Label>
              <Select $error={errors.category} {...register("category", { required: true })}>
                <option value="">Seleccionar...</option>
                {leagues.map(l => <option key={l} value={l}>{l}</option>)}
              </Select>
            </Field>
            <Field>
              <Label>Club / Selección *</Label>
              <Input
                placeholder="FC Barcelona"
                $error={errors.brand}
                {...register("brand", { required: "El club es obligatorio" })}
              />
              {errors.brand && <ErrorMsg>{errors.brand.message}</ErrorMsg>}
            </Field>
          </Row>

          <Field>
            <Label>Nombre de la camiseta *</Label>
            <Input
              placeholder="Camiseta local 1998-99"
              $error={errors.name}
              {...register("name", { required: "El nombre es obligatorio" })}
            />
            {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
          </Field>

          <Field>
            <Label>Descripción *</Label>
            <Textarea
              $error={errors.description}
              {...register("description", { required: "La descripción es obligatoria" })}
            />
            {errors.description && <ErrorMsg>{errors.description.message}</ErrorMsg>}
          </Field>

          <Row>
            <Field>
              <Label>Temporada</Label>
              <Input placeholder="1998-99" {...register("temporada")} />
            </Field>
            <Field>
              <Label>Color</Label>
              <Input placeholder="Azul y grana" {...register("color")} />
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Precio (€) *</Label>
              <Input
                type="number" step="0.01"
                $error={errors.price}
                {...register("price", { required: true, min: 0 })}
              />
            </Field>
            <Field>
              <Label>Stock *</Label>
              <Input
                type="number"
                $error={errors.stock}
                {...register("stock", { required: true, min: 0 })}
              />
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Talla</Label>
              <Select {...register("talla")}>
                <option value="">Seleccionar...</option>
                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field>
              <Label>Rating (0-5)</Label>
              <Input type="number" step="0.1" min="0" max="5" {...register("rating")} />
            </Field>
          </Row>

          <Field>
            <Label>URL de imagen</Label>
            <Input placeholder="https://..." {...register("image_url")} />
          </Field>

          <Field>
            <Label>O sube una imagen (Cloudinary)</Label>
            <Input type="file" accept="image/*" ref={fileRef} />
            {product?.image_url && <ImagePreview src={product.image_url} alt="Imagen actual" />}
          </Field>

          <BtnRow>
            <CancelBtn type="button" onClick={onClose}>Cancelar</CancelBtn>
            <SaveBtn type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear camiseta"}
            </SaveBtn>
          </BtnRow>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default ProductForm;