package processor

import (
	"encoding/binary"
	"fmt"
	"os"
)

func Processor(inputPath string, outPath string) error {
	file, err := os.Open(inputPath)
	if err != nil {
		return fmt.Errorf("could not open file: %v", err)
	}
	defer file.Close()

	var initSegment []byte

	for {
		//TODO read box size (4 bytes)
		sizeBuff := make([]byte, 4)
		_, err := file.Read(sizeBuff)
		if err != nil {
			break
		}
		size := binary.BigEndian.Uint32(sizeBuff)

		// read box type (4 bytes)
		typeBuff := make([]byte, 4)
		_, err = file.Read(typeBuff)
		if err != nil {
			break
		}
		boxType := string(typeBuff)

		//TODO read the rest of the box data
		dataSize := int(size) - 8
		dataBuf := make([]byte, dataSize)
		_, err = file.Read(dataBuf)
		if err != nil {
			break
		}

		//TODO collect ftyp and moov boxes only
		if boxType == "ftyp" || boxType == "moov" {
			initSegment = append(initSegment, sizeBuff...)
			initSegment = append(initSegment, typeBuff...)
			initSegment = append(initSegment, dataBuf...)
		}

		if boxType == "moov" {
			break
		}
	}

	if len(initSegment) == 0 {
		return fmt.Errorf("ftyp or moov box not found in file")
	}

	err = os.WriteFile(outPath, initSegment, 0644)
	if err != nil {
		return fmt.Errorf("could not write output file: %v", err)
	}

	return nil
}