import { useEditorDispatch } from "../../../controllers/editors";
import { useFile } from "../../../controllers/files";
import { Flex } from "../../common/box";

export function FileItem({ fileId }: { fileId: string }) {
  const file = useFile(fileId);
  const dispatch = useEditorDispatch();

  return (
    <Flex>
      <button
        onClick={() => {
          dispatch({
            fileId,
            row: 0,
            column: 0,
            active: true,
            seq: 1,
          });
        }}
      >
        {file.name}
      </button>
    </Flex>
  );
}
