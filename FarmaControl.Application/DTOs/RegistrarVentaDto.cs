namespace FarmaControl.Application.DTOs
{
    public class RegistrarVentaDto
    {
        public List<DetalleVentaDto> Productos { get; set; } = new();
    }
}