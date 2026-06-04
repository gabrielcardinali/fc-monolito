import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private generateUseCase: UseCaseInterface,
    private findUseCase: UseCaseInterface
  ) {}

  generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return this.generateUseCase.execute(input);
  }

  find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
    return this.findUseCase.execute(input);
  }
}
